import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const cityCode = searchParams.get("cityCode");
    const authorization = request.headers.get('authorization');

    try {
        if (!cityCode) {
            const response = await fetch(`${process.env.SPRING_API}/api/provinces/fetch-all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': authorization ? authorization : ''
                },
            });
            const data = await response.json();
            
            // Forward the actual status code from the backend
            if (!response.ok) {
                return NextResponse.json(data, { status: response.status });
            }
            
            return NextResponse.json(data, { status: response.status });
        }
        
        const response = await fetch(`${process.env.SPRING_API}/api/provinces/fetch-wards?cityCode=${cityCode}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': authorization ? authorization : ''
            },
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