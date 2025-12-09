import { NextResponse, NextRequest } from "next/server";
export async function GET(request: NextRequest) {    
    const authorization = request.headers.get('authorization');
    
    try {
        const response = await fetch(`${process.env.SPRING_API}/api/packages/all`, {
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
        console.error('Error calling packages API:', error);
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const authorization = request.headers.get('authorization');
    
    try {
        const response = await fetch(`${process.env.SPRING_API}/api/packages/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization ? authorization : ''
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        // Forward the actual status code from the backend
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }
        
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error calling packages API:', error);
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}
// body = {
    // "userId": "4d756a86-e8fb-4ecb-9ac3-90fed4c6458b",
    // "packageId": "9258a8e8-bb8b-11f0-bfda-0242ac120002A",
    // "months": 3,
    // "paymentAmount": 5000000
// }