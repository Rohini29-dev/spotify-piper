import musicModel from "../models/music.model";
import { getPresignedUrl, uploadFile } from "../services/storage.service";


export async function uploadMusic(req,res)   {
    const musicFile = req.files['music'][0];
    const coverImage = req.files['coverImage'][0]

    try {
        const musicKey = await uploadFile(musicFile)
        const coverImageKey = await uploadFile(coverImage)

const music = await musicModel.create({
    title:req.body.title,
    artist:req.user.fullName.firstName+" "+req.user.fullName.lastName,
    artistId:req.user.id,
    musicKey,
    coverImageKey


}) 

return res.status(201).json({message:'Music Uploaded sussecfully',music})

    } catch (error) {
         console.log(error)  
        return res.status(500).json({ message: 'Internal server error' });
    }

}


export async function getArtistMusics(req,res) {
    try {
        
const musicDocs = await musicModel.find({artistId:req.user.id}).lean()

const musics = []

for (const music of musicDocs) {
    const musicUrl = await getPresignedUrl(music.musicKey)
    const coverImageurl =  await getPresignedUrl(music.coverImageKey)

    musics.push(music)
} 

return res.status(200).json({musics})

    } catch (error) {
         console.log(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
}