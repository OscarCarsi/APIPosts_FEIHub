const {Router} = require('express');
const {
    createPost,
    editPostPut,
    deletePost,
    postsByAuthorGet,
    postByIdAndTitleGet,
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
} = require ('../controllers/posts');
const router = Router();
router.post('/createPost', createPost);
router.put('/editPost', editPostPut);
router.delete('/deletePost/:id', deletePost);
router.get('/postsAuthor/:author', postsByAuthorGet);
router.get('/postIdTitle', postByIdAndTitleGet);
router.get('/principalPosts', principalPostsGet);
router.get('/principalPostsTarget', principalPostByTargetGet);
router.post('/addComment', createCommentPost);
router.put('/editComment', editCommentPut);
router.delete('/deleteComment', deleteComment);
router.put('/like/:id', addLikePut);
router.put('/dislike/:id', addDislikePut);
router.put('/removeLike/:id', removeLikePut);
router.put('/removeDislike/:id', removeDislikePut);
router.put('/addReport', addReportPost);
router.get('/reportedPost', postReported);
module.exports = router;