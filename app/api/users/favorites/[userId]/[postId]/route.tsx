import { NextResponse, NextRequest } from "next/server";

interface RouteParams {
  params: {
    userId: string;
    postId: string;
  };
}

// GET - Check if a favorite exists or get favorite details
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { userId, postId } = await params;
  const authorization = request.headers.get('authorization');

  try {
    const response = await fetch(
      `${process.env.SPRING_API}/api/users/favorites/${userId}/${postId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization ? authorization : ''
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
            { message: "Favorite post not found" }, 
            { status: response.status }
        );
      }
      return NextResponse.json(
        { message: "Failed to check favorite status" }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);    
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}