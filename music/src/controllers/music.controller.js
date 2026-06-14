import musicModel from "../models/music.model";
import playlistModel from "../models/playlist.model";
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


export async function getAllMusic(req,res) {
    const { skip = 0, limit = 10} = req.query

    try {
        const musicDocs = await musicModel.find().skip(skip).limit(limit).lean()

    const musics = []

    for (const music of musicDocs) {
        music.musicUrl = await getPresignedUrl(music.musicKey)

        music.coverImage = await getPresignedUrl(music.coverImageKey)

        musics.push(music)

    }

    return res.status(200).json({message:'music fetched successfully',musics})


    } catch (error) {
         console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    
    }
    
}

export async function getMusicById(req,res) {
    const { id } = req.params;
    try {
        const music = await musicModel.findById(id).lean()

        if(!music){
            return res.status(404).json({
                message:"music not found"
            })
        }

        music.musicUrl = await getPresignedUrl(music.musicKey)
        music.coverImage = await getPresignedUrl(music.coverImageKey)

        return res.status(200).json({music})

    } catch (error) {
     console.log(error);
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


export async function createPlaylist(req,res) {
    const {title , musics} = req.body

try {
    const playlist = await playlistModel.create({
        artist:req.user.fullName.firstName + ' '+req.user.fullName.lastName,
        artistId:req.user.id,
        title,

        userId:req.user.id,
        musics

    })

    return res.status(201).json({message:'playlist create Successfully ', playlist})


} catch (error) {
    console.log(error);
    return res.status(500).json({message:'Internal server error'})
    
}

}



export async function getPlaylist(req,res) {
    try {
        const playlist = await playlistModel.find({artistId : req.user.id})

        return res.status(200).json({playlist})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    
        
    }
}

export async function getPlaylistById(req,res) {
    const { id } = req.params
try {
    const playlistDoc = await playlistModel.findById(id).lean()

if(!playlistDoc){
    return res.status(404).json({
        message:"Playlist not found"
    })
}


    const musics = [] 

    for (const musicId of playlistDoc.musics) {
        const music = await musicModel.findById(musicId).lean()
        
        if(music){
                music.musicUrl = await getPresignedUrl(music.musicKey)
    
                music.coverImageUrl = await getPresignedUrl(music.coverImageKey)
    
                musics.push(music)
                }

    }

    playlistDoc.musics = musics

return res.status(200).json({playlist: playlistDoc})

} catch (error) {
    
 console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}




