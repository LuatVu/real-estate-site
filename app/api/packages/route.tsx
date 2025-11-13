import { NextResponse, NextRequest } from "next/server";
export async function GET(request: NextRequest) {    
    const authorization = request.headers.get('authorization');
    const response = await fetch(`${process.env.SPRING_API}/api/packages/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization ? authorization : ''
        }
    });
    const data = await response.json();
    return NextResponse.json(data);
}