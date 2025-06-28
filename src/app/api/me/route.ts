import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://kanban-board-backend-3bfa.onrender.com";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  
  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/api/auth/me`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });
    
  } catch {
    return NextResponse.json(
      { 
        error: "Internal proxy error", 
        status: 500 
      },
      { status: 200 } 
      
    );
  }
}