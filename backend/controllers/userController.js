import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import validator from 'validator'
import bycrypt from 'bcrypt'
import { json } from "express";


const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//route for user login
const loginUser = async (req,res) => {
    
}

//routes for user registration
const registerUser =async (req,res) => {

    try {
        const{name,email,password}= req.body;
        
        //checking user already exist or not
        const exists =await userModel.findOne({email})

        if (exists){
            return res.json({success:false,message:"user already exist"})
        }
        
        //validating email for format and strong pssword

        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"please enter a valid email"})
            
        }
        if (password.length<8){
            return res.json({success:false,message:"please enter a strong password"})
            
        }
        //hashing user password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password,salt)
        

        const newUser =new userModel({
            name,
            email,
            password:hashedPassword
        })

        const user =await newUser.save() 

        const token = createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//route for admin login
const adminLogin = async (req,res) => {
    
}


export {loginUser,registerUser,adminLogin}