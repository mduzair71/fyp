import connectDB from "@/lib/db";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    // Check both 'Users' and 'users' collections
    const usersCapital = await db.collection("Users").find({}).toArray();
    const usersLower = await db.collection("users").find({}).toArray();

    return Response.json({ 
      success: true, 
      countCapital: usersCapital.length,
      countLower: usersLower.length,
      data: usersCapital.length > 0 ? usersCapital : usersLower
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}