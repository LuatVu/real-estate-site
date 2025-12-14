import { NextResponse, NextRequest } from "next/server";
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    try{
        const authorization = req.headers.get('authorization');
        const response = await fetch(`${process.env.SPRING_API}/api/posts/renew/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': authorization || ''
            },
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(
                { status: response.status.toString(), message: "Failed to renew post" }, 
                { status: response.status }
            );
        }
        return NextResponse.json(
            { status: data.status || "200", message: data.message || "Post renewed successfully" },
            { status: 200 }
        );
    }catch(error){
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}