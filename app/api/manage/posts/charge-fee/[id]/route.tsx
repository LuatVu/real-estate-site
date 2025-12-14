import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;    
    if (!id) {
        return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    const authorization = request.headers.get('authorization');
    try {
        const response = await fetch(`${process.env.SPRING_API}/api/manage/posts/charge-fee/${id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': authorization || ''},        
        });
        
        const data = await response.json();
        
        // Forward the actual status code from the backend
        if (!response.ok) {
            return NextResponse.json({ status: response.status, message: data.message || "Failed to fetch charge fee data" }, { status: response.status });
        }
        
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}