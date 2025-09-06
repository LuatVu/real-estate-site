import { NextResponse, NextRequest } from "next/server";
export async function POST(request: NextRequest) {
    try{                
        const formdata = await request.formData();                
        const authorization = request.headers.get('authorization');
        const response = await fetch(`${process.env.SPRING_API}/api/media/draft/upload`, {
            method: 'POST',
            headers: {                
                'Authorization': authorization || ''
            },
            body: formdata
        });
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to upload draft images" }, { status: response.status });
        }   
        const data = await response.text();
        console.log(data);
        return NextResponse.json({ "imageUrl": data });
    }catch(error: any){
        if (error.message) {
            return NextResponse.json(
                {
                    error: "Failed to upload to Spring API",
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