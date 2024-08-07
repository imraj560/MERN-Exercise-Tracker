require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workoutRouter');
const userRoutes = require('./routes/userRouter');
const cors = require('cors')
const app = express();
/**Some more changes */

var corsOptions = {
    origin: 'https://creative-bunny-7517e7.netlify.app',
    //origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

//default middleware
app.use(express.json());


app.use((req, res, next)=>{

    console.log(req.path, req.method);
    next();
})



//routes for workout api
app.use('/api/workout', cors(corsOptions), workoutRoutes);
//app.use('/api/workout', workoutRoutes);

//routes for user Auth
app.use('/api/user', cors(corsOptions), userRoutes);
//app.use('/api/user', userRoutes);

app.use('/images', cors(corsOptions), express.static('uploads'));
//app.use('/images', express.static('uploads'));

//Database connect
mongoose.connect(process.env.MONGO_URI).then(()=>{

    app.listen(process.env.PORT, ()=>{

        console.log('ConneWctescd ds to DB, port no:', process.env.PORT);
    })

}).catch((error)=>{

    console.log(error);
})