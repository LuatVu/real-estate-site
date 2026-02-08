import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const authorization = request.headers.get('authorization');
    try{
        const response = await fetch(`${process.env.SPRING_API}/api/manage/posts/all-charge-fee`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': authorization || ''},
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ status: response.status, message: data.message || "Failed to fetch all charge fee data" }, { status: response.status });
        }
        return NextResponse.json(data, { status: response.status });
    }catch(error){
        return NextResponse.json(
            { status: "500", message: "Internal server error" }, 
            { status: 500 }
        );
    }
}
/** 
 * sample response:
 * {
    "status": "200 OK",
    "response": [
        {
            "postChargeFeeId": "9773af8b-d5dc-11f0-8f3e-0242ac110002",
            "priorityLevel": "DIAMOND",
            "reupFee": 50000.0,
            "renewFee": 200000.0,
            "status": 1
        },
        {
            "postChargeFeeId": "9774406e-d5dc-11f0-8f3e-0242ac110002",
            "priorityLevel": "GOLD",
            "reupFee": 30000.0,
            "renewFee": 100000.0,
            "status": 1
        }        
    ]
}
*/
