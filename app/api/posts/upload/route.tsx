import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Parse the multipart form data from the client
        const formData = await req.formData();
        
        // Extract files
        const files = formData.getAll('files') as File[];
        
        // Extract and validate the JSON data
        const dataString = formData.get('data') as string;
        
        if (!dataString) {
            return NextResponse.json(
                { error: "Missing data field" },
                { status: 400 }
            );
        }

        // Validate JSON format
        let postData;
        try {
            postData = JSON.parse(dataString);
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid JSON data format" },
                { status: 400 }
            );
        }

        // Create a new FormData object to forward to Spring API
        const springFormData = new FormData();
        
        // Add all files to the form data
        files.forEach((file) => {
            if (file instanceof File) {
                springFormData.append('files', file, file.name);
            }
        });
        
        // Add the data field
        springFormData.append('data', dataString);

        // Get authorization header if present
        const authHeader = req.headers.get('authorization');
        
        // Prepare headers for Spring API request
        const headers: HeadersInit = {};
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        // Forward the request to Spring API
        const springApiUrl = `${process.env.SPRING_API}/api/posts/upload`;
        const response = await fetch(springApiUrl, {
            method: 'POST',
            body: springFormData,
            headers,
        });

        // Handle Spring API response
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Spring API error:', errorData);
            return NextResponse.json(
                { 
                    error: "Failed to upload post",
                    details: errorData 
                },
                { status: response.status }
            );
        }

        const responseData = await response.json();
        
        return NextResponse.json({
            success: true,
            message: "Post uploaded successfully",
            data: responseData,
        }, { status: 201 });

    } catch (error) {
        console.error("Error uploading post:", error);
        return NextResponse.json(
            { 
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}