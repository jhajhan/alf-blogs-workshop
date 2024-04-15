const Post = require('../models/postModel')
const deleteFile = require('../utils/deleteFile')
//CREATE

// @desc    Create a Post
// @route   POST /posts
// access   Public

const createPost = async (req, res) => {
    //Validate if req.body exists
    if (!req.body) {
        res.status(400).json({error: 'No request body'})
    }
    const {title, author, content} = req.body

    const path = req.file?.path ?? null
    try {
        const post = new Post({
            title,
            author,
            content,
            cover_photo: path
        })

        const newPost = await post.save()

        if (newPost) {
            res.status(201).json(newPost)
        }
    } catch (error) {
        console.log(error)
        res.status(422).json(error)
    }
}

//UPDATE

// @desc    Update a Post
// @route   PUT|PATCH /posts/:id
// access   Public

const updatePost = async (req, res) => {
    //Validate if req.body exists
    if (!req.body) {
        res.status(400).json({error: 'No request body'})
    }

    const { id } = req.params
    const {title, author, content} = req.body

    //Optionally check if req.file exists
    const path = req.file?.path ?? null
    try {
        // Find the Post 
        const originalPost = await Post.findById(id)
        // If there is no post, return
        if (!originalPost) {
            return res.status(404).json({ error: 'Original Post Not Found'})
        }
        //Handle deleting of the previous photo
        //Only delete the photo if there's a newly uploaded file
        
        if (originalPost.cover_photo && path) {
            deleteFile(originalPost.cover_photo)
        }

        //Update the fields of the original posts
        originalPost.title = title
        originalPost.author = author
        originalPost.content = content
        originalPost.cover_photo = path

        const updatedPost = await originalPost.save()
        res.status(200).json(updatedPost)
        //Save post
        //Return
    } catch (error) {
        console.log(error)
        res.status(422).json(error)
    }
}

//READ

// @desc    Get All Posts
// @route   GET /posts
// access   Public
const getAllPosts = async (req, res) => {
    try {
         const posts = await Post.find()
         res.json(posts)
    } catch (error) {
        console.log(error)
    }
}

// @desc    Show Specified Posts
// @route   GET /posts/:id
// access   Public
const showPost = async (req, res) => {
    try {
         const { id } = req.params
         const post = await Post.findById(id)

         if (!post) {
            res.status(404).json({ error: 'Post not Found'})
         }

         res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: 'Post not Found'})
    }
}

// @desc    Delete Posts
// @route   DEL /posts/:id
// access   Public
const deletePost = async (req, res) => {
    try {
         const { id } = req.params
         const post = await Post.findByIdAndDelete(id)

         if (post.cover_photo) {
            deleteFile(post.cover_photo)
         }


         if (!post) {
            res.status(404).json({ error: 'Post not Found'})
         }

         res.status(200).json({ message: 'Successfully deleted post'})
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: 'Post not Found'})
    }
}
module.exports = {
    getAllPosts,
    createPost,
    updatePost,
    showPost,
    deletePost
}