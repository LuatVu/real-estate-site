import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const response = await fetch('http://localhost:8080/api/posts/search-post', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VydGVzdDAxQGdtYWlsLmNvbSIsImp0aSI6ImNiZTI0ZjA4LTFhNjYtNGZjZS05ZDMzLTkzNzkzMTZlMGU0ZSIsImlhdCI6MTc1MDA4OTI0NywiZXhwIjoxNzUwOTUzMjQ3fQ.JiuByA3oco0LWl2OU3sNidSRDtbvjslwZZJNeWeX5-U'},        
        body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
}


export async function GET(request: NextRequest) {        
    const postId = request?.nextUrl?.searchParams.get('postId');
    const response = await fetch(`http://localhost:8080/api/posts/get-post?postId=${postId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VydGVzdDAxQGdtYWlsLmNvbSIsImp0aSI6ImNiZTI0ZjA4LTFhNjYtNGZjZS05ZDMzLTkzNzkzMTZlMGU0ZSIsImlhdCI6MTc1MDA4OTI0NywiZXhwIjoxNzUwOTUzMjQ3fQ.JiuByA3oco0LWl2OU3sNidSRDtbvjslwZZJNeWeX5-U'},        
    });
    const data = await response.json();    
    return NextResponse.json(data);

}