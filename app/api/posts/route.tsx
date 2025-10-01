import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const page = Number(req?.nextUrl?.searchParams.get('page')) - 1; // aim to start with zero    

    const response = await fetch(`${process.env.SPRING_API}/api/public/search-post?page=${page}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
}