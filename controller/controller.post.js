const Post = require("../models/model.post");
const cloudinary = require("../utility/utility.cloudinary");
const CREATE_POST = async (req, res) => {
  try {
    const urls = [];
    const uploader = async (path) =>
      await cloudinary.uploader.upload(path, {
        folder: "post_images",
      });

    const files = req.files;
    if (req.method === "POST") {
      for (const file of files) {
        const { path } = file;

        const newPath = await uploader(path);
        urls.push(newPath.url);
      }
    } else {
      res.status(405).json({
        errorr: "Images not uploaded successfully",
      });
    }

    const post = new Post({
      userId: req.body.userId,
      userProfile: req.body.userProfile,
      userName: req.body.userName,
      userPostText: req.body.userPostText,
      userPostImage: urls,
      userType: req.body.userType,
    });
    const saveNewPost = await post.save();

    if (saveNewPost) {
      res.status(200).json(saveNewPost);
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to create a post!" });
    console.log(err.message);
  }
};

// get all the post
const GET_ALL_POST = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ error: "Cannot fetch any post!" });
  }
};

// delete Post
const DELETE_POST = async (req, res) => {
  try {
    const findPostTodelete = await Post.deleteOne({ _id: req.params.postId });
    res.status(200).json({ message: "Successfully deleted!" });
  } catch (error) {
    res.status(400).json({ error: "An error occured!" });
  }
};
module.exports = {
  CREATE_POST,
  GET_ALL_POST,
  DELETE_POST,
};
