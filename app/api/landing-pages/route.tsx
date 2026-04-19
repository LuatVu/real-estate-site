import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
    try {
        // Get user session for authentication
        const authorization = req.headers.get('authorization');
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Bạn cần đăng nhập để sử dụng tính năng này' },
                { status: 401 }
            );
        }

        const body = await req.json();
        
        // Validate required fields
        if (!body.title || !body.sections) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'Thiếu thông tin tiêu đề hoặc nội dung trang' },
                { status: 400 }
            );
        }

        // Prepare data for backend API
        const landingPageData = {
            id: body.id || undefined, // Use existing ID for updates, or let backend generate a new one
            title: body.title,
            address: body.address || '',
            sections: body.sections,
            isPublic: body.isPublic || false,
            userId: session.user.id || session.user.email, // Use user ID or email as fallback
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Call your Spring Boot backend API
        const response = await fetch(`${process.env.SPRING_API}/api/landing-pages/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',                
                'Authorization': authorization || '', // Use the authorization header from the request
            },
            body: JSON.stringify(landingPageData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { 
                    error: 'Backend Error', 
                    message: errorData.message || 'Có lỗi xảy ra khi lưu trang vào hệ thống' 
                },
                { status: response.status }
            );
        }

        const result = await response.json();
        
        return NextResponse.json({
            success: true,
            message: 'Trang landing đã được lưu thành công',
            id: result.id,
            url: result.url || `/landing/${result.id}`,
            data: result
        });

    } catch (error) {
        console.error('Error saving landing page:', error);
        return NextResponse.json(
            { 
                error: 'Internal Server Error', 
                message: 'Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.' 
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
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
        const page = searchParams.get('page') || '0';
        const userId = session.user.id || session.user.email;

        // Get user's landing pages from backend
        const response = await fetch(
            `${process.env.SPRING_API}/api/landing-pages/user/${userId}?page=${page}`,
            {
                headers: {
                    'Authorization': authorization || '',
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch landing pages');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching landing pages:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const authorization = req.headers.get('authorization');
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        
        if (!body.id) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'Landing page ID is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.SPRING_API}/api/landing-pages/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization || '',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            return NextResponse.json(
                { error: 'Backend Error', message: errorData.message },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json({
            success: true,
            message: 'Trang landing đã được cập nhật thành công',
            data: result
        });

    } catch (error) {
        console.error('Error updating landing page:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}