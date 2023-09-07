import connectDB from "@/backend/config/connectDB";
import Products from "@/backend/models/product";
import APIFilters from "@/backend/utils/APIFilters";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const requestData = await request.json(); // Parse the incoming JSON data

    const product = await Products.create(requestData); // Use .create as a static method

    return NextResponse.json(
      { product, message: "Post created successfully" },
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
export async function GET(req) {
  try {
    connectDB();
    const resPerPage = 3;
    const productsCount = await Products.countDocuments();

    const { search } = new URL(req.url);
    //console.log(search);
    const queryParams = new URLSearchParams(search);
    const apiFilters = new APIFilters(Products.find(), queryParams)
      .search()
      .filter();
    let products = await apiFilters.query;
    const filteredProductsCount = products.length;
    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone(); // Assuming apiFilters.query returns the filtered products

    return NextResponse.json(
      {
        productsCount,
        resPerPage,
        filteredProductsCount,
        products,
        message: "Products retrieved successfully",
      },
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
