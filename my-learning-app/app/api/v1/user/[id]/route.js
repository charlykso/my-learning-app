import dbConnect from '@/lib/dbConnection';
import User from '@/model/User';
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    await dbConnect()
    const { id } = await params
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect()
    const { id } = await params
    try {
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect()
    const { id } = await params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const { email, name, phone} = await request.json();
        user.email = email;
        user.name = name;
        user.phone = phone;
        user.updated_at = Date.now();
        await user.save();
        return NextResponse.json({ success: true, data: user }, { status: 200 });
        
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
