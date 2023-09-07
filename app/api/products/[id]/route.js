import connectDB from "@/backend/config/connectDB";
import Products from "@/backend/models/product";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {

    try {
      connectDB();
        const {id} = params;
      
        const product = await Products.findOne({ _id: id }); 
  
      return NextResponse.json(
        {  product, message: "Products retrieved successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error:", error); 
      return NextResponse.json( 
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
  