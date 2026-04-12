import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const {userId} = await params;
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const authorization = request.headers.get('authorization');    
    const response = await fetch(`${process.env.SPRING_API}/api/users/favorites/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization ? authorization : ''
        },
    });
    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch user's favorite posts" }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
}