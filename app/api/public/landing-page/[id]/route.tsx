import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Landing Page ID is required" }, { status: 400 });
    }
    try{
        const response = await fetch(`${process.env.SPRING_API}/api/public/landing-page/${id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},        
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error fetching landing page:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}