import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
    try {
        // Get user session for authentication
        const authorization = req.headers.get('authorization');
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Bạn cần đăng nhập để tải lên hình ảnh' },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const image = formData.get('image') as File;
        const landingPageId = formData.get('landingPageId') as string;

        if (!image) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'Không tìm thấy file hình ảnh' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!image.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'File tải lên phải là hình ảnh' },
                { status: 400 }
            );
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (image.size > maxSize) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'File quá lớn. Kích thước tối đa cho phép là 5MB' },
                { status: 400 }
            );
        }

        // Create form data for backend
        const backendFormData = new FormData();
        backendFormData.append('image', image);
        backendFormData.append('landingPageId', landingPageId);
        backendFormData.append('userId', session.user.id || session.user.email);
        backendFormData.append('type', 'landing-page');

        // Call your Spring Boot backend API
        const response = await fetch(`${process.env.SPRING_API}/api/media/upload/landing-image`, {
            method: 'POST',
            headers: {
                // Don't set Content-Type header, let the browser set it with boundary for multipart
                'Authorization': authorization || '',
            },
            body: backendFormData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend upload error:', errorText);
            
            return NextResponse.json(
                { 
                    error: 'Upload Error', 
                    message: 'Có lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại.' 
                },
                { status: response.status }
            );
        }

        const result = await response.json();
        
        return NextResponse.json({
            success: true,
            message: 'Tải lên hình ảnh thành công',
            url: result.url,
            filename: result.filename,
            size: result.size,
            type: result.type
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { 
                error: 'Internal Server Error', 
                message: 'Có lỗi hệ thống xảy ra khi tải lên hình ảnh' 
            },
            { status: 500 }
        );
    }
}

// Optional: Handle DELETE request to remove images
export async function DELETE(req: NextRequest) {
    try {
        const authorization = req.headers.get('authorization');
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const imageUrl = searchParams.get('url');
        
        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'Image URL is required' },
                { status: 400 }
            );
        }

        // Call backend to delete image
        const response = await fetch(`${process.env.SPRING_API}/api/media/delete-image`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization || '',
            },
            body: JSON.stringify({
                imageUrl,
                userId: session.user.id || session.user.email
            })
        });

        if (!response.ok) {
            throw new Error('Failed to delete image');
        }

        return NextResponse.json({
            success: true,
            message: 'Hình ảnh đã được xóa thành công'
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}