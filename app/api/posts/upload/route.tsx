import { NextResponse, NextRequest } from "next/server";
export async function POST(req: NextRequest) {
    try {
        // Get the original content type header from the request
        const originalContentType = req.headers.get('content-type');
        console.log('Original Content-Type:', originalContentType);

        // Get the raw body
        const body = await req.arrayBuffer();
        console.log('Body size:', body.byteLength);

        // Get authorization header if present
        const authHeader = req.headers.get('authorization');

        // Prepare headers for Spring API request
        const headers: any = {
            'Content-Type': originalContentType || 'multipart/form-data'
        };
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        console.log('Headers for Spring API:', headers);

        // Forward the request to Spring API
        const springApiUrl = `${process.env.SPRING_API}/api/posts/upload`;
        
        console.log('Spring API URL:', springApiUrl);
        console.log('Environment SPRING_API:', process.env.SPRING_API);

        try {
            const response = await fetch(springApiUrl, {
                method: 'POST',
                body: body,
                headers: headers,
            });

            console.log('Spring API response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Spring API error response:', errorText);
                throw new Error(`Spring API error: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            const responseData = await response.json();
            console.log('Spring API response data:', responseData);

            return NextResponse.json({
                success: true,
                message: "Post uploaded successfully",
                data: responseData
            }, { status: 201 });

        } catch (fetchError: any) {
            console.error('Fetch error details:', {
                message: fetchError.message,
                url: springApiUrl
            });
            
            // If it's a connection error to Spring API
            if (fetchError.message.includes('fetch failed') || fetchError.code === 'ECONNREFUSED') {
                return NextResponse.json(
                    {
                        error: "Spring API is not available",
                        details: `Cannot connect to Spring API at ${springApiUrl}. Make sure the Spring Boot server is running on port 8080.`
                    },
                    { status: 503 } // Service Unavailable
                );
            }
            
            throw fetchError; // Re-throw to be caught by outer catch block
        }



    } catch (error: any) {
        console.error("Error uploading post:", error);

        // Handle fetch errors specifically
        if (error.message) {
            return NextResponse.json(
                {
                    error: "Failed to upload to Spring API",
                    details: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}