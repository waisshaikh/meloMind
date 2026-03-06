const userModel = require('../Modules/user.model');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const balckListModel = require('../Modules/blacklist');


 
async function registerUser  (req,res){
    const {username,email,password} = req.body

    const isUserExist = await userModel.findOne({
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

    const user = await userModel.create({
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
    const isUserRegisterd = await userModel.findOne({
        $or:[{username:username},       
            {email:email}
        ]
    }).select("+password")

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

   const isTokenBlaclkListed = await balckListModel.findOne({
    token
   });

   if(isTokenBlaclkListed){
    return res.status(401).json({
       message: "token is balcklisted"
    })
   }

   return res.status(200).json({
    messgae:"User Login"
   })


}


async function getMe(req, res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User fetched successfully",
        user
    })
}

async function logoutUser (req,res){
    const token = req.cookies.token
    res.clearCookie("token");
    await balckListModel.create({
        token
    })
    res.status(201).json({
        message:"Logout Sucessfull"
    })
}

module.exports={
    registerUser,
    loginUser,
    getMe,
    logoutUser
}