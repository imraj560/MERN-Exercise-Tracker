const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({

    email:{

        type: String,
        required: true,
        unique:true
    },

    password:{

        type: String,
        required: true
    }
})

userSchema.statics.signup = async function(email, password){

    if(!email || !password){

        throw Error('All fields must be filled');
    }

    if(!validator.isEmail(email)){

        throw Error('Wrong Email Format');
    }

    if(!validator.isStrongPassword(password)){

        throw Error('Password is too Weak');
    }

    const exists = await this.findOne({email})

    if(exists){

        throw Error('This email is already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({email, password: hash})

    return user;
}

userSchema.statics.login = async function(email, password){

    if(!email || !password){

        throw Error('All fields must be filled');
    }

    if(!validator.isEmail(email)){

        throw Error ('The email is not proper');
    }

    const user = await this.findOne({email});

    if(!user){

        throw Error('This Email does not exist');
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match){

        throw Error ('Wrong Password');
    }

    return user;
}

module.exports = mongoose.model('user', userSchema);