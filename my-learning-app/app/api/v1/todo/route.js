import Todo from "@/model/Todo";
import dbConnect from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import User from "@/model/User";

export async function GET() {
    try {
        await dbConnect();
        const todos = await Todo.find().populate("user", "name email phone");
        return NextResponse.json(todos, { status: 200 });
    }catch(err){
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const { title, description, completed, user } = await request.json();
        if (!title || !description) {
            return NextResponse.json(
                { success: false, message: "Title and description fields are required" },
                { status: 400 }
            );
        }
        const newTodo = new Todo({
            title,
            description,
            completed,
            user,
        });
        const todo = await newTodo.save();
        return NextResponse.json(
            { success: true, message: "Todo created successfully", data: todo },
            { status: 201 }
        );
    }catch(err){
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}