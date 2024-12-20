const express = require('express');
const {locationList, totalTypes, destroyReply, getReply, newWorkout, userWorkout, findWorkout, deleteWorkout, updateWorkout, homeWorkout, downloadImage, likePost, dislikePost, totalReactions, postComment, getComment, destroyComment, replyComment} = require('../controllers/workoutController');
const requireAuth = require('../middleware/requireAuth')
const multer = require('multer')
const router = express.Router();


/**Multer methods for image upload */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
      // cb(null, __dirname +'/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

//get all workouts
router.get('/home', homeWorkout)
router.get('/download/:filename', downloadImage)
router.get('/commentlist/:id', getComment)
router.get('/replylist/:id', getReply)
router.get('/location',locationList)



/**the below middleware prevents unauthorized access */
router.use(requireAuth)


/**All routes */

/**Destroy Reply */
router.delete('/deleteReply/:id', destroyReply)

/**Reply Comment */
router.post('/reply', replyComment)

/**Delete Comment */
router.delete('/deleteComment/:id', destroyComment)

/**Add comment */
router.post('/comment', postComment)

/**Total Reactions */
router.get('/total', totalReactions)

/**Total types */
router.get('/types', totalTypes)

//POST a workout like
router.put('/like', likePost);

//POST a workout dislike
router.put('/dislike', dislikePost)

//GET user workouts
router.get('/profile', userWorkout);

//GET a single workout
router.get('/:id', findWorkout);

//POST a new workout
router.post('/upload', upload.single('file'), newWorkout);

//DELETE a workout
router.delete('/:id', deleteWorkout);

//UPDATE/PATCH a workout
router.patch('/:id', upload.single('file'), updateWorkout);

//grabing server image




module.exports = router;