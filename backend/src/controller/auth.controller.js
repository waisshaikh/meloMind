const usermodel = require('../Modules/user.model');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');


 
async function registerUser  (req,res){
    const {username,email,password} = req.body

    const isUserExist = await usermodel.findOne({
        $or:[{username:username},
            {email:email }
   
        ]
    })

    if(isUserExist){
        return res.status(400).json({
            "message":"User Already Exist"
        });
    }

    const hash = bcrypt.hashSync(password,10);

    const user = await usermodel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({
        id:user._id},
        // { username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"3d"}
)

res.cookie("token",token)
return res.status(201).json({
    message:"registerd"
    
});
  
}

async function loginUser (req,res){
    const {username,email,password} = req.body
    const isUserRegisterd = await usermodel.findOne({
        $or:[{username:username},
            {email:email}
        ]
    });

    if(!isUserRegisterd){
       return  res.status(401).json({
        messge:"Not Login with this email id or username"

        })
    }

    const isMatch = await bcrypt.compare(password,isUserRegisterd.password);
    if(!isMatch){
        return res.status(401).json({
            message:"Invalid password"
        })
    }

    const token = jwt.sign(
        {id:isUserRegisterd._id},
        process.env.JWT_SECRET,
        {expiresIn:"3d"}
    )

   res.cookie("token",token);

   return res.status(200).json({
    messgae:"User Login"
   })


}

module.exports={
    registerUser,
    loginUser
}