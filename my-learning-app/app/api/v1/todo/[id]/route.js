import dbConnect from "@/lib/dbConnection";
import Todo from "@/model/Todo";
import { NextResponse } from "next/server";
import User from "@/model/User";

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const {id} = await params;
        const todo = await Todo.findById(id).populate("user", "name email phone");
        if (!todo) {
            return NextResponse.json({ success: false, message: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: todo }, { status: 200 });
    } catch (err) {
        console.error("Error fetching todo:", err);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try{
        await dbConnect();
        const { id } = await params;
        const todo = await Todo.findByIdAndDelete(id);
        if(!todo){
            return NextResponse.json({ success: false, message: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Todo deleted successfully" }, { status: 200 });
    }catch(err){
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try{
        await dbConnect();
        const { id } = await params;
        const todo = await Todo.findById(id);
        if(!todo){
            return NextResponse.json({ success: false, message: "Todo not found" }, { status: 404 });
        }
        const { title, description, completed, user } = await req.json();
        todo.title = title;
        todo.description = description;
        todo.completed = completed;
        todo.user = user;
        todo.updated_at = Date.now();
        await todo.save();
        return NextResponse.json({ success: true, data: todo }, { status: 200 });
    }catch(err){
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
