import express from 'express'
import multer from 'multer'
import  * as musicController  from "../controllers/music.controller.js";
import  * as authMiddleware  from "../middlewares/auth.middleware.js";

const upload = multer({
    storage:multer.memoryStorage()
})

const router = express.Router()

/* POST /api/music/upload */

router.post('/upload',authMiddleware.authArtistMiddleware,upload.fields([
    {name:'music',maxCount:1},
    {name:'coverImage',maxCount:1}
]),musicController.uploadMusic)

/* GET /api/music/ */

router.get('/',authMiddleware.authUserMiddleware,musicController.getAllMusic)

/* GET /api/music/get-details/:id */

router.get('/get-details/:id',authMiddleware.authUserMiddleware,musicController.getMusicById)


/* GET /api/music/artist-music */

router.get('/artist/music',authMiddleware.authArtistMiddleware, musicController.getArtistMusics)

/* POST /api/music/playlist */

router.post('/playlist',authMiddleware.authArtistMiddleware,musicController.createPlaylist)

/* GET /api/music/playlist */

router.get('/playlist',authMiddleware.authUserMiddleware,musicController.getPlaylist)


/* GET /api/music/playlist/:id */

router.get('/playlist/:id',authMiddleware.authUserMiddleware,musicController.getPlaylistById)



export default router 