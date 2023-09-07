import connectDB from "@/backend/config/connectDB";
import User from "@/backend/models/user";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
      await connectDB();
      const {name, email, password} = await request.json(); // Parse the incoming JSON data
  
      const user = await User.create({
        name,
        email,
        password,
      }); // Use .create as a static method
  
      return NextResponse.json(
        { user, message: "Post created successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }