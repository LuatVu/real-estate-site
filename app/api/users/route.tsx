import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    // Handle user creation logic here
    const authorization = request.headers.get('authorization');
    const response = await fetch(`${process.env.SPRING_API}/api/users/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization ? authorization : ''
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        return NextResponse.json({ error: "Failed to update user data" }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
}