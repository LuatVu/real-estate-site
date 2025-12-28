import { NextResponse, NextRequest } from "next/server";
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const authorization = request.headers.get('authorization');
        const response = await fetch(`${process.env.SPRING_API}/api/media/delete/image/${id}`, {
            method: 'POST',
            headers: {                
                'Authorization': authorization || ''
            }
        });
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to delete image" }, { status: response.status });
        }
        return NextResponse.json({ message: "Image deleted successfully" });
    }catch(error: any){
        if (error.message) {
            return NextResponse.json(
                {
                    error: "Failed to delete image from Spring API",
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