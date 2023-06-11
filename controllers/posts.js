const { response } = require('express');
const postsDAO = require('../dao/postsDAO');
const {use} = require('../routes/posts');

const createPost = async (req, res = response) => {
    const { title, author, body, dateOfPublish, photos, target} = req.body;
    try {
        const post = { title, author, body, dateOfPublish, photos, target};
        const newPost = await postsDAO.addNewPost(post);
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "We were unable to create your post, try again later"});
    }
}
const editPostPut = async(req, res = response) => {
    const { id, title, body, dateOfPublish, target, photos} = req.body;
    try{
        const post = { title, body, dateOfPublish, target, photos };
        const editedPost = await postsDAO.editPost(post, id);
        res.status(200).json(editedPost);
    } catch(error){
        console.error(error);
        res.status(500).json({message: "There was an error editing your post, try again later."});
    }
}
const deletePost = async(req, res= response) => {
    const id = req.params;
    try{
        await postsDAO.deletePost(id);
        res.status(200).json({message: "Deleted post"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "It has not been possible to delete your post, try again later", error})
    }
}
const postsByAuthorGet = async (req, res = response) => {
    const author = req.params;
    try{
        const posts = await postsDAO.getPostsByAuthor(author)
        res.status(200).json(posts);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "It was not possible to retrieve the publications, please try again later.", error});
    }
}
const postsRandomByTarget = async (req, res = response) => {
    const target = req.params.target;
    try{
        const posts = await postsDAO.getRecentRandomPostsByTarget(target)
        res.status(200).json(posts);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "It was not possible to retrieve the publications, please try again later.", error});
    }
}
const postByIdAndTitleGet = async (req, res = response) => {
    const {id, title} = req.body;
    try{
        const post = await postsDAO.getPostByIdAndTitle(id, title);
        res.status(200).json(post);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"It was not possible to retrieve the publications, please try again later.", error })
    }
}
const principalPostsGet = async (req, res = response) => {
    const {authors, target, author} = req.body;
    try{
        const posts = await postsDAO.getRecentPostsByAuthors(authors, target, author);
        res.status(200).json(posts);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"It was not possible to retrieve the publications, please try again later.", error })
    }
}
const principalPostByTargetGet = async (req, res = response) => {
    const {authors, target} = req.body;
    try{
        const posts = await postsDAO.getRecentPostsByAuthorsAndTarget(authors, target);
        res.status(200).json(posts);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"It was not possible to retrieve the publications, please try again later.", error })
    }
}
const createCommentPost = async (req, res = response) => {
    const {author, body, dateOfComment, idPost} = req.body;
    try{
        const newComment = {author, body, dateOfComment}
        const comment = await postsDAO.addComment(newComment, idPost);
        res.status(200).json(comment);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"It was not possible to retrieve the publications, please try again later.", error })
    }
}
const editCommentPut = async (req, res = response) => {
    const {postId, commentId, newBody} = req.body;
    try{
        const editedComment = await postsDAO.editComment(postId, commentId, newBody);
        res.status(200).json(editedComment);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"It was not possible to retrieve the publications, please try again later.", error })
    }
}
const deleteComment = async (req, res = response) => {
    const { postId, commentId } = req.body;
    try {
      const postWithoutComment = await postsDAO.deleteComment(postId, commentId);
      res.status(200).json({ post: postWithoutComment, message: "Deleted comment" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "It has not been possible to delete your comment, try again later", error });
    }
}  
const addLikePut = async (req, res = response) => {
    const postId = req.params;
    try {
        await postsDAO.addLike(postId);
        res.status(200).json({message: "Liked post"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "It was not possible to like this post, try again later.", error})
    }
}
const addDislikePut = async (req, res = response) => {
    const postId = req.params;
    try {
        await postsDAO.addDislike(postId);
        res.status(200).json({message: "Disliked post"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "It was not possible to dislike this post, try again later.", error})
    }
}
const removeLikePut = async (req, res = response) => {
    const postId = req.params;
    try {
        await postsDAO.removeLike(postId);
        res.status(200).json({message: "Like removed of this post"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "It was not possible to remove the like on this post, try again later.", error})
    }
}
const removeDislikePut = async (req, res = response) => {
    const postId = req.params;
    try {
        await postsDAO.removeDislike(postId);
        res.status(200).json({message: "Dislike removed of this post"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "It was not possible to remove the dislike on this post, try again later.", error})
    }
}
    const addReportPost = async (req, res = response) => {
        const {postId, totalReports} = req.body;
        try {
            await postsDAO.addReport(postId, totalReports);
            res.status(200).json({message: "Reported post"});
        }catch(error){
            console.error(error);
            res.status(500).json({message: "It was not possible to report this post, try again later.", error})
        }
    }
const postReported = async (req, res = response) => {
    try{
        const posts = await postsDAO.getReportedPosts();
        res.status(200).json(posts);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "It was not possible to retrieve the publications, please try again later.", error});
    }
}
module.exports = {
    createPost,
    editPostPut,
    deletePost,
    postsByAuthorGet,
    postByIdAndTitleGet,
    postsRandomByTarget,
    principalPostsGet,
    principalPostByTargetGet,
    createCommentPost,
    editCommentPut,
    deleteComment,
    addLikePut,
    addDislikePut,
    removeLikePut,
    removeDislikePut,
    addReportPost,
    postReported
};
