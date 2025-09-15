import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const authorization = req.headers.get('authorization');
    const response = await fetch(`${process.env.SPRING_API}/api/manage/get-posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization ? authorization : ''
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);
}