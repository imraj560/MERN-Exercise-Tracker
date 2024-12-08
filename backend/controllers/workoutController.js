const Workout = require('../models/workoutModel');
const Comment = require('../models/commentModel')
const User = require('../models/userModel')
const Reply = require('../models/replyModel')
const mongoose = require('mongoose');
const fs = require('fs')
const path = require('path');
const { error } = require('console');


/**All workout  */

const homeWorkout = async(req, res) => {

    await Workout.aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            wtime:1,
            wdate:1,
            wtype:1,
            image:1,
            likes:1,
            dislikes:1,
            user_id:1,
            location:1,
            // If 'friends' doesn't exist, treat it as an empty array
            likesCount: { $size: { $ifNull: ["$likes", []] } },
            dislikesCount: { $size: { $ifNull: ["$dislikes", []] } },

           
            
          }
        },
        {
            $sort:{_id: -1}
        }
      ])
        .then(results => {
            res.status(200).json(results);

        })
        .catch(err => {
          console.error(err);
        });
   
}



/**Add a single workout */
const newWorkout = async(req, res) => {


   const image = req.file.filename

   const user_id = req.user._id

   const {title, wdate, wtime, wtype, location} = req.body

    try{

         const workout = await Workout.create({title, wtime, wdate, wtype, image, user_id, location});
         res.status(200).json(workout);

    }catch(error){

        res.status(400).json({error:error.message});
    }
   
}

/**Add a single comment */
const postComment = async(req, res) => {

    const user_id = req.user._id;
    const {comment, postId} = req.body;

    try{

        const name = await User.findById(user_id).select('name -_id');
      
        const postComment = await Comment.create({user_id, comment, postId, name:name.name});

        if(postComment){

            res.status(200).json({'message':'Comment Added', postComment}) 
        }
        

    }catch(error){

        res.status(400).json({error})
    }


   
}

/**Get comments */
const getComment =  async(req, res)=>{

    const {id} = req.params;

    try{

        const comments = await Comment.find({postId : id})

        if(comments){

            res.status(200).json({comments})

          
        }

    }catch(error){

        res.status(400).json({error})
    }

   
}

const destroyComment = async(req, res)=>{

   const {id} = req.params;//commentId
   const user_id = req.user._id;

   const comDel = await Comment.findOne({_id:id}).select('user_id');

   if(comDel.user_id == user_id){

       if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).json({error: 'Invalid mongoId'});
        }

        const comments = await Comment.findOneAndDelete({_id: id});
        const reply = await Reply.deleteMany({commentId: id});

        if(comments && reply){

            const message = "Comment Deleted";
           res.status(200).json({message, comments})
        }
        
   }else{

   
          const message = "Invalid Auth";
          res.status(400).json({message})
        
   }

   
}

/**Post Reply */
const replyComment = async(req, res)=>{

    const {commentId, content} = req.body;
    const user_id = req.user._id;
   

    try{
        
        const name = await User.findById(user_id).select('name -_id');
        const reply = await Reply.create({commentId, content, user_id, name:name.name});

        if(reply){

            await Comment.findByIdAndUpdate(commentId, {$push: {replies: reply._id} });
            const message = "Reply Posted";
            res.status(200).json({message, reply})
        }

    }catch(error){

        res.status(400).json({error});
    }
    

   


   

}


/**Get reply */
const getReply =  async(req, res)=>{

    const {id} = req.params;

    try{

        const reply = await Reply.find({commentId : id})

        if(reply){

            res.status(200).json({reply})

          
        }

    }catch(error){

        res.status(400).json({error})
    }

   
}

const destroyReply = async(req, res)=>{

    const {id} = req.params;//ReplyId
    const user_id = req.user._id;
 
    const repDel = await Reply.findOne({_id:id}).select('user_id');
 
    if(repDel.user_id == user_id){
 
        if(!mongoose.Types.ObjectId.isValid(id)){
 
         return res.status(404).json({error: 'Invalid mongoId'});
         }
 
         const reply = await Reply.findOneAndDelete({_id: id});
 
         if(reply){
 
             const message = "Reply Deleted";
            res.status(200).json({message, reply})
         }
         
    }else{
 
    
           const message = "Invalid Auth";
           res.status(400).json({message})
         
    }
}

/**Like a post */
const likePost = async(req, res) => {

    const user_id = req.user._id;
    const {postId} = req.body
    const workoutId = await Workout.findById(postId);

    const unique = workoutId.likes.some(likeid => likeid == user_id)
    if(!unique){

        try{
        
            const workout = await Workout.findByIdAndUpdate(postId, {
                
                $push:{likes:user_id},  $pull:{dislikes:user_id}
            }, {new: true})

            const likesCount = workout.likes.length
            const dislikesCount = workout.dislikes.length


                const workoutArray = {'_id':workout._id, 'title': workout.title, 'wtime': workout.wtime,'wdate': workout.wdate, 'wtype':workout.wtype,'image': workout.image,
                    'likes':workout.likes, 'dislikes':workout.dislikes, 'likesCount':likesCount, 'dislikesCount':dislikesCount}  

                // console.log(workoutArray)    
                    
                res.status(200).json({"message":'Post liked','workoutArray':workoutArray})

                

            

        }catch(error){

            res.status(400).json({error:error.message});

        }

    }else{

        const likesCount = workoutId.likes.length
        const dislikesCount = workoutId.dislikes.length
        const workoutArray = {'_id':workoutId._id, 'title': workoutId.title, 'wtime': workoutId.wtime,'wdate': workoutId.wdate, 'wtype':workoutId.wtype,'image': workoutId.image,
            'likes':workoutId.likes, 'dislikes':workoutId.dislikes, 'likesCount':likesCount, 'dislikesCount':dislikesCount}  
        res.status(200).json({"message":'Already Liked','workoutArray':workoutArray})

    }

}

/**Dislike Post */
const dislikePost = async(req, res) => {

    const user_id = req.user._id;
    const {postId} = req.body
    const workoutId = await Workout.findById(postId);

    const unique = workoutId.dislikes.some(likeid => likeid == user_id)

    if(!unique){

        try{
        
        const workout = await Workout.findByIdAndUpdate(postId, {
            
            $pull:{likes:user_id},  $push:{dislikes:user_id}
        }, {new: true}) 
        

        const likesCount = workout.likes.length
        const dislikesCount = workout.dislikes.length


        const workoutArray = {'_id':workout._id, 'title': workout.title, 'wtime': workout.wtime,'wdate': workout.wdate, 'wtype':workout.wtype,'image': workout.image,
        'likes':workout.likes, 'dislikes':workout.dislikes, 'likesCount':likesCount, 'dislikesCount':dislikesCount}

        res.status(200).json({"message":'Post Disliked','workoutArray':workoutArray})

        }catch(error){

            res.status(400).json({error:error.message});

        }
    }else{

        const likesCount = workoutId.likes.length
        const dislikesCount = workoutId.dislikes.length
        const workoutArray = {'_id':workoutId._id, 'title': workoutId.title, 'wtime': workoutId.wtime,'wdate': workoutId.wdate, 'wtype':workoutId.wtype,'image': workoutId.image,
            'likes':workoutId.likes, 'dislikes':workoutId.dislikes, 'likesCount':likesCount, 'dislikesCount':dislikesCount}  
        res.status(200).json({"message":'Already Disliked','workoutArray':workoutArray})
    }
    
   
}

const totalReactions = async(req, res)=>{

   const user_id = await req.user._id;
   const objectString = `${user_id}`

   await Workout.aggregate([

    {
        $match: { user_id: objectString }
    },
   
    {
      $project: {

        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalDislikes: { $size: { $ifNull: ["$dislikes", []] } }

      }
    },
    {
        $group: {
          _id: null, 
          totalLikeslength: { $sum: "$totalLikes" },  
          totalDislikeslength: { $sum: "$totalDislikes" }  
        }
      },

      {
        $project: {
          _id: 0,  
           totalLikeslength:1,
           totalDislikeslength:1,

        }
      }  


  ])
    .then(results => {
        res.status(200).json(results);
        console.log(results)

    })
    .catch(err => {
      console.error(err);
    });



   
}

/**Count Types */
const totalTypes = async(req, res)=>{

    const user_id = req.user._id;

        const weight = await Workout.countDocuments({['wtype']: 'weight'})
        const calesthenics = await Workout.countDocuments({['wtype']: 'calesthenics'})
        const cardio = await Workout.countDocuments({['wtype']: 'cardio'})

        const arrayData = [];

        arrayData.push(weight, calesthenics, cardio)

       

            res.status(200).json({arrayData})
            console.log(arrayData)
            
        

    

  
    
}




/**All workout by user */
const userWorkout = async(req, res) => {

    const user_id = await req.user._id;
    const objectString = `${user_id}`
    
    await Workout.aggregate([
       
        {
          $project: {
            _id: 1,
            title: 1,
            wtime:1,
            wdate:1,
            wtype:1,
            image:1,
            likes:1,
            dislikes:1,
            user_id:1,
            // If 'friends' doesn't exist, treat it as an empty array
            likesCount: { $size: { $ifNull: ["$likes", []] } },
            dislikesCount: { $size: { $ifNull: ["$dislikes", []] } },

          }
        },

        {
            $match: { user_id: objectString }

        }
      ])
        .then(results => {
            res.status(200).json(results);
            console.log(results)

        })
        .catch(err => {
          console.error(err);
        });

   
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

/**location list */

const locationList = async(req, res)=>{

    await Workout.aggregate([
        {
          $group: {
            
            _id: "$location",
           
            
          }
        },
        {
            $sort:{_id: -1}
        }
      ])
        .then(results => {
            res.status(200).json(results);

        })
        .catch(err => {
          console.error(err);
        });


}


/**Delete a workout */
const deleteWorkout = async(req, res)=>{

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).error({error: 'Invalid mongoose Id'})
    }

    const {image} = await Workout.findOne({_id: id}).select('image');
   
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

    const {title, wtime, wdate, wtype, oldimage, location} = req.body

    //if there is no new image file for edit
    if(!req.file){

        const workout = await Workout.findOneAndUpdate({_id: id}, {title, wtime, wdate, wtype, location});

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
    downloadImage,
    likePost,
    dislikePost,
    totalReactions,
    postComment,
    getComment,
    destroyComment,
    replyComment,
    getReply,
    destroyReply,
    totalTypes,
    locationList
}