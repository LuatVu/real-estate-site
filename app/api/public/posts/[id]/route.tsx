import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    
    try {
        // Check if SPRING_API environment variable is set
        if (!process.env.SPRING_API) {
            console.error('SPRING_API environment variable is not set');
            return NextResponse.json(
                { status: "500", message: "Backend API not configured" }, 
                { status: 500 }
            );
        }

        const response = await fetch(`${process.env.SPRING_API}/api/public/get-post/${id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},        
        });
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Backend returned non-JSON response, content-type:', contentType);
            const text = await response.text();
            console.error('Backend response body:', text.substring(0, 200) + '...');
            return NextResponse.json(
                { status: "502", message: "Backend returned invalid response" }, 
                { status: 502 }
            );
        }
        
        const data = await response.json();
        
        // Forward the actual status code from the backend
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }
        
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}