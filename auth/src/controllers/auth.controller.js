import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import _config from '../config/config.js';
import {publishToQueue} from '../broker/broker.js'


export async function register(req,res) {
  const {email,password, fullName:{firstName,lastName},role = 'user'} = req.body  

  try {

    const isAlreadyUserExistes = await userModel.findOne({email})

    if(isAlreadyUserExistes){
        return res.status(400).json({
            message:'user already exists'
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        email,
        password:hash,
        fullName:{
            firstName,
            lastName
        },
        role
    })

    await publishToQueue('user_create',{
        id:user.id,
        email:user.email,
        fullName:user.fullName,
        role:user.role
    })

    const token = jwt.sign({
        id:user.id,
        role:user.role,
        fullName:user.fullName
    },_config.JWT_SECRET)


    res.cookie(token)

    return res.status(201).json({
        message:"user registerd successfully ",
        user:{
             id: user.id,
            email: user.email,
            fullname: user.fullname,
            role: user.role
        }
    })
    
  } catch (error) {
    console.error('error =>',error);

    // res.status(500).json({error})
    
  }
}

export async function login(req,res) {
    const {email,password} = req.body
try {
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password" 
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        })
    }

    const token = jwt.sign({
        id:user.id,
         role:user.role,
        fullName:user.fullName
    },_config.JWT_SECRET,{expiresIn:'2d'})

    res.cookie('token',token)

    return res.status(200).json({
        message:"user logged sucessfully",
        user:{
            id:user.id,
            email:user.email,
            fullName:user.fullName,
            role:user.role
        }
    })
    
} catch (error) {
    console.log(error);
    
}

}


export async function googleAuthCallback(req,res) {
    const user = req.user
// console.log(user);




    const isUserAlreadyExist = await userModel.findOne({
        $or:[
            {email:user.emails[0].value},
            {googleId:user.id}
        ]
    })


    if(isUserAlreadyExist){
        const token = jwt.sign({
            id:isUserAlreadyExist.id,
            email:isUserAlreadyExist.email,
            fullName:isUserAlreadyExist.fullName
        },_config.JWT_SECRET,{expiresIn:'2d'})

        res.cookie('token',token)

        if(isUserAlreadyExist === 'artist'){
        return redirect('http://localhost:5173/artist/dashboard')
    }

    return res.redirect('http://localhost:5173')

    }

    const newUser = await userModel.create({
        googleId:user.id,
        email:user.emails[0].value,
        fullName:{
            firstName:user.name.givenName,
            lastName:user.name.familyName
        }
    })

    await publishToQueue('user_create',{
        id:newUser.id,
        email:newUser.email,
        fullName:newUser.fullName,
        role:newUser.role
    })

    const token = jwt.sign({
        id:newUser.id,
        role:newUser.role,
        fullName:newUser.fullName
    },_config.JWT_SECRET,{expiresIn:'2d'})

    res.cookie('token',token)

    res.redirect('http://localhost:5173')

  

    

}



