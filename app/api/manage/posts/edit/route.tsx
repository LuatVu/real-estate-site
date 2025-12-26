import { NextResponse, NextRequest } from "next/server";
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const authorization = request.headers.get('authorization');
        const response = await fetch(`${process.env.SPRING_API}/api/manage/posts/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization || ''
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to edit post" }, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        // Handle fetch errors specifically
        if (error.message) {
            return NextResponse.json(
                {
                    error: "Failed to edit post in Spring API",
                    details: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}