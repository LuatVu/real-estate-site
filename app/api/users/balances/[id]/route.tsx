import { NextResponse, NextRequest } from "next/server";
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const authorization = request.headers.get('authorization');
    
    try {
        const response = await fetch(`${process.env.SPRING_API}/api/users/balances/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization ? authorization : ''
            }
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