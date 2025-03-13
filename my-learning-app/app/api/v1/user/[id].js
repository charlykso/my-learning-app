import mongoose from 'mongoose'
import dbConnect from '../../../../lib/dbConnection'
import User from '../../../../model/User'

export default async function handler(req, res) {
  await dbConnect()
  const { id } = req.query
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' })
  }
  switch (req.method) {
    case 'GET':
      return await handleGetRequest(id, res)
    case 'PUT':
      return await handlePutRequest(id, req.body, res)
    case 'DELETE':
      return await handleDeleteRequest(id, res)
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function handleGetRequest(id, res) {
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    return res.status(200).json({ success: true, data: user })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

async function handlePutRequest(id, data, res) {
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const { firstname, lastname, phone, email } = data
    user.firstname = firstname
    user.lastname = lastname
    user.phone = phone
    user.email = email
    await user.save()
    res
      .status(200)
      .json({ success: true, message: 'User updated successfully' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

async function handleDeleteRequest(id, res) {
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    await user.remove()
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
