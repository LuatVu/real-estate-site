import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const page = Number(req?.nextUrl?.searchParams.get('page')) - 1; // aim to start with zero    

    try {
        const body = await req.json();
        const response = await fetch(`${process.env.SPRING_API}/api/public/search-post?page=${page}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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