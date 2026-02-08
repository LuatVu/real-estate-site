import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const authorization = request.headers.get('authorization');
        const response = await fetch(`${process.env.SPRING_API}/api/posts/update-priority`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization || ''
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ status: response.status, message: data.message || "Failed to update priority" }, { status: response.status });
        }
        return NextResponse.json(data);
    }catch (error) {
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}
/**
 * sample request body:
 * {
    "postId": "484e1488-0b13-4b50-b19d-1cd0c1ab1d6d",
    "priorityLevel": "DIAMOND"
}
*/