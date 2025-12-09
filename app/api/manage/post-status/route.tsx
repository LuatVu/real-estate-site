import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {    
    const postId = req?.nextUrl?.searchParams.get('postId');
    const status = req?.nextUrl?.searchParams.get('status');
    const authorization = req.headers.get('authorization');
    
    try {
        const response = await fetch(`${process.env.SPRING_API}/api/manage/update-post-status?postId=${postId}&status=${status}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization ? authorization : ''
            }, 
        });
        
        const data = await response.json();
        
        // Forward the actual status code from the backend
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }
        
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}