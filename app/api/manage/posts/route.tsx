import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const authorization = req.headers.get('authorization');
    
    try {
        const body = await req.json();
        const response = await fetch(`${process.env.SPRING_API}/api/manage/get-posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization ? authorization : ''
            },
            body: JSON.stringify(body)
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