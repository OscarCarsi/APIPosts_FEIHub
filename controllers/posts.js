const { response } = require('express');
const postsDAO = require('../dao/postsDAO');
const {use} = require('../routes/posts');
/**
 * @swagger
 * /createPost/:
 *  post:
 *    summary: create new post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      title:
 *        type: String
 *        description: title post
 *      author:
 *        type: String
 *        description: author to the post
 *      body:
 *        type: String
 *        description: contain body of post
 *      dateOfPublish:
 *        type: date
 *        description: date of post
 *      photos:
 *        type: []
 *        description: array with url photos
 *      target:
 *        type: String
 *        description: target of post
 *    responses:
 *      200:
 *        description: post created
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /editPost/:
 *  put:
 *    summary: edit a post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      title:
 *        type: String
 *        description: title post
 *      body:
 *        type: String
 *        description: contain body of post
 *      dateOfPublish:
 *        type: date
 *        description: date of post
 *      photos:
 *        type: []
 *        description: array with url photos
 *      target:
 *        type: String
 *        description: target of post
 *    responses:
 *      200:
 *        description: post edited
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /createPost/:
 *  post:
 *    summary: create new chat
 *    tags : [Posts]
 *    requestParameters:
 *      required.true
 *    content:
 *      id:
 *        type: String
 *        description: id post
 *      200:
 *        description: post deleted
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /postsAuthor/:author:
 *  get:
 *    summary: get post by a author
 *    tags : [Posts]
 *    requestParameters:
 *      required.true
 *    content:
 *      author:
 *        type: String
 *    responses:
 *      200:
 *        description: get posts
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /postsTarget/:target:
 *  get:
 *    summary: get post by a target and everybody
 *    tags : [Posts]
 *    requestParameters:
 *      required.true
 *    content:
 *      target:
 *        type: String
 *    responses:
 *      200:
 *        description: get posts
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /postsIdTitle/:
 *  post:
 *    summary: get post by a id and title
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      id:
 *        type: String
 *      title:
 *        type: String
 *    responses:
 *      200:
 *        description: get posts
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /principalPosts/:
 *  post:
 *    summary: get principal posts
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      author:
 *        type: String
 *      target:
 *        type: String
 *      authors:
 *          type: []
 *    responses:
 *      200:
 *        description: get posts
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /principalPostsTarget/:
 *  post:
 *    summary: get post by target
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      authors:
 *        type: []
 *      target:
 *        type: String
 *    responses:
 *      200:
 *        description: get posts
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /addComment/:
 *  post:
 *    summary: add comment to a post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      author:
 *        type: String
 *        description: author to the comment
 *      body:
 *        type: String
 *        description: contain body of comment
 *      dateOfComment:
 *        type: date
 *        description: date of comment
 *      idPost:
 *        type: String
 *        description: id of post
 *    responses:
 *      200:
 *        description: comment created
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /editComment/:
 *  put:
 *    summary: edit comment to a post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      newBody:
 *        type: String
 *        description: contain body of comment
 *      commentId:
 *        type: date
 *        description: id of comment
 *      postId:
 *        type: String
 *        description: id of post
 *    responses:
 *      200:
 *        description: comment edited
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /deleteComment/:
 *  delete:
 *    summary: delete comment
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      commentId:
 *        type: date
 *        description: id of comment
 *      postId:
 *        type: String
 *        description: id of post
 *    responses:
 *      200:
 *        description: post without comment
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /like/:id:
 *  put:
 *    summary: add like to post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      id:
 *        type: String
 *        description: id of post
 *    responses:
 *      200:
 *        description: post with like
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /dislike/:id:
 *  put:
 *    summary: add dislike to post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      id:
 *        type: String
 *        description: id of post
 *    responses:
 *      200:
 *        description: post with dislike
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /removeLike/:id:
 *  put:
 *    summary: remove like to post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      id:
 *        type: String
 *        description: id of post
 *    responses:
 *      200:
 *        description: post without like
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /removeDislike/:id:
 *  put:
 *    summary: remove dislike to post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      id:
 *        type: String
 *        description: id of post
 *    responses:
 *      200:
 *        description: post without dislike
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /addReport/:
 *  put:
 *    summary: add report to post
 *    tags : [Posts]
 *    requestBody:
 *      required.true
 *    content:
 *      postId:
 *        type: String
 *        description: id of post
 *      totalReports:
 *         type: int
 *         description: total reports to post
 *    responses:
 *      200:
 *        description: post with reports
 *      500:
 *        description: error server
 */
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
/**
 * @swagger
 * /like/:id:
 *  post:
 *    summary: get post reported
 *    tags : [Posts]
 *    responses:
 *      200:
 *        description: post reported
 *      500:
 *        description: error server
 */
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
