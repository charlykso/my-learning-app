import dbConnect from '@/lib/dbConnection'
import User from '@/model/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { setCookie } from 'cookies-next'

export async function GET() {
  try {
    await dbConnect()
    const users = await User.find().select('-password') // select all fields except password
    return NextResponse.json(users, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const { name, phone, email, password } = await request.json()
    if (!phone || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      )
    }
    const existingPhone = await User.findOne({ phone })
    if (existingPhone) {
      return NextResponse.json(
        { message: 'Phone number already exists' },
        { status: 409 }
      )
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    })
    const user = await newUser.save()
    user['password'] = undefined
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    setCookie('token', token, { request, maxAge: 60 * 60, httpOnly: true })
    return NextResponse.json(
      { success: true, message: 'User created succesfully', data: user, token: token },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
