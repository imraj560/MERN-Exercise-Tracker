const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')


/**All the functions for the API CRUD functionality */


/**All workout  */

const homeWorkout = async(req, res) => {


    const workouts = await Workout.find({}).sort({_id:-1});

    if(workouts){

         res.status(200).json(workouts);
    }

   
   
}



/**Add a single workout */
const newWorkout = async(req, res) => {


   const image = req.file.filename

   const user_id = req.user._id

   const {title, wdate, wtime, wtype} = req.body

    try{

         const workout = await Workout.create({title, wtime, wdate, wtype, image, user_id});
         res.status(200).json(workout);

    }catch(error){

        res.status(400).json({error:error.message});
    }
   
}


/**All workout by user */
const userWorkout = async(req, res) => {

    const user_id = req.user._id

    const workouts = await Workout.find({user_id: user_id}).sort({_id: -1});

    res.status(200).json(workouts);
}



/**Grab single workout */
const findWorkout = async(req, res)=>{

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).json({error: 'Invalid mongoId'});
    }

    const workout = await Workout.findById(id);

    if(!workout){

        return res.status(404).json({error:'No such workouts found'});
    }

    return res.status(200).json(workout);


}


/**Delete a workout */
const deleteWorkout = async(req, res)=>{

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).error({error: 'Invalid mongoose Id'})
    }

    const {image} = await Workout.findOne({_id: id}).select('image')

   

   
    const workout = await Workout.findOneAndDelete({_id: id});
    

    if(!workout){

    res.status(400).json({error: 'No such Rercord Found'});

    return

    }


    fs.unlink(`./uploads/${image}`, (error)=>{

        console.log(error)
        return
    })
    

    

    res.status(200).json(workout);
}


/**Update a workout */
const updateWorkout = async(req, res)=>{

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){

        res.status(404).error({error: "Invalid mongoose Id"});
    }

    const {title, wtime, wdate, wtype, oldimage} = req.body

    //if there is no new image file for edit
    if(!req.file){

        const workout = await Workout.findOneAndUpdate({_id: id}, {title, wtime, wdate, wtype});

        if(!workout){

            return res.status(400).json({error: 'Update unsuccessfull'});
            }   

        return res.status(200).json(workout);
    }

    //if there is new image file for edit
    if(req.file){

        const image = req.file.filename

        const workout = await Workout.findOneAndUpdate({_id: id}, {title,  wtime, wdate, wtype, image});

        fs.unlink(`./uploads/${oldimage}`, (error)=>{

                 console.log(error)
               
             })

          if(!workout){

         return res.status(400).json({error: 'Update unsuccessfull'});
         }   

         return res.status(200).json(workout);
    }




}


const downloadImage = async(req, res) =>{


    const fileName = req.params.filename
    const filePath = path.join(__dirname, '../uploads', fileName)

    try{

        if(fs.existsSync(filePath)){

            res.sendFile(filePath)
           
        }else{

            res.status(404).send('File not found')
        }

    }catch(error){

        console.log(error)
    }

    
}


module.exports = {

    newWorkout,
    userWorkout,
    homeWorkout,
    findWorkout,
    deleteWorkout,
    updateWorkout,
    downloadImage
}