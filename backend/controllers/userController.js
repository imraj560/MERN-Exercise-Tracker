const User = require('../models/userModel');

const jwt = require('jsonwebtoken');

const createToken = (_id)=>{

    return jwt.sign({_id}, process.env.SECRET, {expiresIn:'3d'});
}


/**Login function */
const loginUser = async(req, res)=>{

    const {email, password} = req.body;

    try{

        const user = await User.login(email, password);

        const token = createToken(user._id);

        const { name } = await User.findOne({ '_id': user._id }, 'name');
        res.status(200).json({name, email, token})

    }catch(error){

        res.status(400).json({error:error.message})
    }
}


/**Register function */
const signupUser = async(req, res)=>{

    const {name, email, password, cPassword} = req.body;

    try{

        const user = await User.signup(name, email, password, cPassword)

        const token = createToken(user._id);

        res.status(200).json({name, email, token})
        
    }catch(error){

        res.status(400).json({error: error.message})
    }
}

module.exports = {loginUser, signupUser};