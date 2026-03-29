import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    let page = Number(req?.nextUrl?.searchParams.get('page'));
    if (!isNaN(page) && page > 0) {
        page = page - 1; // Adjust for zero-based indexing
    } else {
        page = 0; // Default to page 0 if invalid
    }
    let size = Number(req?.nextUrl?.searchParams.get('size'));
    if (isNaN(size) || size <= 0) {
        size = 10; // Default to 10 if invalid
    }
    try{
        const body = await req.json();
        const response = await fetch(`${process.env.SPRING_API}/api/public/search-landing-page?page=${page}&size=${size}`, {
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
    }catch(error){
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}