import { uploadFile } from "../services/storage.service.js";
import musicModel from "../models/music.model.js"
import playlistModel from "../models/playlist.model.js";
import mongoose from "mongoose";



export async function uploadMusic(req, res) {

    const musicFile = req.files[ 'music' ][ 0 ];
    const coverImageFile = req.files[ 'coverImage' ][ 0 ];


    try {

      const musicResult = await uploadFile(musicFile, "songs");
const coverResult = await uploadFile(coverImageFile, "covers");
          

     const music = await musicModel.create({
    title: req.body.title,
    artist: `${req.user.fullName.firstName} ${req.user.fullName.lastName}`,
    artistId: req.user.id,
    musicKey: musicResult.url,
    coverImageKey: coverResult.url
});

return res.status(201).json({
    message: "Music uploaded successfully",
    music
});
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' });
    }


}



export async function getMusicById(req, res) {
    const { id } = req.params;

    try {
        const music = await musicModel.findById(id).lean();

        if (!music) {
            return res.status(404).json({
                message: "Music not found"
            });
        }

        music.musicUrl = `http://localhost:3002${music.musicKey}`;
        music.coverImageUrl = `http://localhost:3002${music.coverImageKey}`;

        return res.status(200).json({
            message: "Music fetched successfully",
            music
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getAllMusics(req, res) {
    const { skip = 0, limit = 10 } = req.query;

    try {
        const musicsDocs = await musicModel
            .find()
            .skip(Number(skip))
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .lean();

        const musics = musicsDocs.map((music) => ({
            ...music,
            musicUrl: `${process.env.BASE_URL}${music.musicKey}`,
coverImageUrl: `${process.env.BASE_URL}${music.coverImageKey}`,
        }));

        return res.status(200).json({
            message: "Musics fetched successfully",
            musics
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getArtistMusics(req, res) {
    try {
        const musicsDocs = await musicModel
            .find({ artistId: req.user.id })
            .lean();

        const musics = musicsDocs.map((music) => ({
            ...music,
            musicUrl: `${process.env.BASE_URL}${music.musicKey}`,
            coverImageUrl: `${process.env.BASE_URL}${music.coverImageKey}`,
        }));

        return res.status(200).json({
            musics
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}



export async function createPlaylist(req, res) {

    const { title, musics } = req.body;

    try {

        const playlist = await playlistModel.create({
            artist: `${req.user.fullName.firstName} ${req.user.fullName.lastName}`,
            artistId: req.user.id,
            title,
            userId: req.user.id,
            musics
        });

        return res.status(201).json({
            message: "Playlist created successfully",
            playlist
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



export async function getPlaylists(req, res) {
  try {
    const playlists = await playlistModel
      .find()
      .populate("musics");

    const playlistsWithUrls = playlists.map((playlist) => {
      return {
        _id: playlist._id,
        title: playlist.title,
        artist: playlist.artist,
        artistId: playlist.artistId,

        musics: playlist.musics.map((music) => {
          return {
            _id: music._id,
            title: music.title,
            artist: music.artist,
            artistId: music.artistId,

            musicUrl: `http://localhost:3002${music.musicKey}`,

            coverImageUrl: `http://localhost:3002${music.coverImageKey}`,
          };
        }),
      };
    });

    return res.status(200).json({
      message: "Playlists fetched successfully",
      playlists: playlistsWithUrls,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getPlaylistById(req, res) {

    const { id } = req.params;

    try {

        const playlistDoc = await playlistModel.findById(id).lean();

        if (!playlistDoc) {
            return res.status(404).json({
                message: "Playlist not found"
            });
        }

        const musics = [];

        for (const musicId of playlistDoc.musics) {

            const music = await musicModel.findById(musicId).lean();

            if (music) {

                music.musicUrl =
                    `http://localhost:3002${music.musicKey}`;

                music.coverImageUrl =
                    `http://localhost:3002${music.coverImageKey}`;

                musics.push(music);
            }
        }

        playlistDoc.musics = musics;

        return res.status(200).json({
            message: "Playlist fetched successfully",
            playlist: playlistDoc
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });

    }

}

export async function getArtistPlaylists(req, res) {
    try {
        const playlists = await playlistModel.find({
            artistId: req.user.id,
        }).lean();

        const updatedPlaylists = await Promise.all(
            playlists.map(async (playlist) => {

                let coverImageUrl = "";

                if (playlist.musics.length > 0) {
                    const firstMusic = await musicModel.findById(
                        playlist.musics[0]
                    ).lean();

                    if (firstMusic) {
                        coverImageUrl = `http://localhost:3002${firstMusic.coverImageKey}`;
                    }
                }

                return {
                    ...playlist,
                    coverImageUrl,
                };
            })
        );

        return res.status(200).json({
            playlists: updatedPlaylists,
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}



// Delete playlist — owner only
export async function deletePlaylist(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid playlist ID",
      });
    }

    const playlist = await playlistModel.findById(id);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    // Verify that the logged-in artist owns this playlist
    if (String(playlist.artistId) !== String(req.user.id)) {
      return res.status(403).json({
        message: "You are not allowed to delete this playlist",
      });
    }

    await playlist.deleteOne();

    return res.status(200).json({
      message: "Playlist deleted successfully",
      playlistId: id,
    });
  } catch (error) {
    console.error("DELETE PLAYLIST ERROR:", error);

    return res.status(500).json({
      message: "Unable to delete playlist",
    });
  }
}