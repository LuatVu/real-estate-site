import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    const response = await fetch(`${process.env.SPRING_API}/api/public/get-post/${id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},        
    });
    const data = await response.json();    
    return NextResponse.json(data);
}