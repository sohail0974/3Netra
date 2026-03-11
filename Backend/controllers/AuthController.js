const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const Signup = async(req,res) => {
    try{
    const {name,email,password} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
        return res.status(403)
                .json({message : "user already exists",
                success: false
            })

    };
    const newUser = new UserModel({name,email,password});
    newUser.password = await bcrypt.hash(password,10);
    await newUser.save();
    res.status(201).json({
        message:"Signup Successful",
        success:true
    })
    }
    catch(error){
        res.status(500).json({
            message:"server error",
            success:false
        })
    }
}

const Login = async(req,res) => {
    try{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(403)
            .json({message : "Login failed please enter valid Email or Password",
                success: false
            })

    };
    const isCorrect = await bcrypt.compare(password,user.password)
    if(!isCorrect){
         return res.status(403)
            .json({message : "Invalid Password",
                success: false
            })
    }
    const jwtToken = jwt.sign({email:user.email,_id:user._id},
        process.env.JWT,
        {expiresIn: "24h"}
    )
    
    res.status(201).json({
        message:"Signup Successful",
        success:true,
        jwtToken,
        email,
        name:user.name
    })
    }
    catch(error){
        res.status(500).json({
            message:"server error",
            success:false
        })
    }
}
module.exports={
    Signup,
    Login
}