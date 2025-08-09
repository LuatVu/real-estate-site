import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const authorization = request.headers.get('authorization');    
    const response = await fetch(`${process.env.SPRING_API}/api/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization ? authorization : ''
        },
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}