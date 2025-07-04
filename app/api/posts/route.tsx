import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const page = Number(req?.nextUrl?.searchParams.get('page')) - 1; // aim to start with zero    

    const response = await fetch(`http://localhost:8080/api/posts/search-post?page=${page}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
}


export async function GET(request: NextRequest) {        
    const postId = request?.nextUrl?.searchParams.get('postId');
    const response = await fetch(`http://localhost:8080/api/posts/get-post?postId=${postId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},        
    });
    const data = await response.json();    
    return NextResponse.json(data);

}