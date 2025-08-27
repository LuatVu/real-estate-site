import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const cityCode = searchParams.get("cityCode");
    const authorization = request.headers.get('authorization');

    if (!cityCode) {
        const response = await fetch(`${process.env.SPRING_API}/api/provinces/fetch-all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': authorization ? authorization : ''
            },
        });
        const data = await response.json();
        return NextResponse.json(data);
    }
    
    const response = await fetch(`${process.env.SPRING_API}/api/provinces/fetch-wards?cityCode=${cityCode}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': authorization ? authorization : ''
        },
    });
    const data = await response.json();

    return NextResponse.json(data);
}