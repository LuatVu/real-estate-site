import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const response = await fetch(`${process.env.SPRING_API}/api/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Registration failed" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}