import { NextResponse, NextRequest } from "next/server";
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
    }
    const authorization = request.headers.get('authorization');
    const response = await fetch(`${process.env.SPRING_API}/api/packages/registerByUser/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization ? authorization : ''
        }
    });
    const data = await response.json();
    return NextResponse.json(data);
}