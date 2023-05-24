const {posts} = require ('../models');
class postsDAO{
    static async addNewPost(post){
        return await posts.create(post);
    }
    static async editPost(post, id){
        const updatedPost = await posts.update(post, {where:{id}})
        return updatedPost;
    }
    static async deletePost(id){
        return await posts.destroy ({where:{id}})
    }
    static async getPostsByAuthor(author) {
        const allPosts = await posts.findAll({ 
            where: { author: author },
            order: [['dateOfPublish', 'DESC']]
        });
        return allPosts;
    }
    static async getPostByIdAndTitle(id, title){
        return await posts.findOne({where:{id,title}});
    }
    static async getRecentPostsByAuthors(authors) {
        const date = new Date();
        date.setDate(date.getDate() - 2);
        const recentPosts = await posts.aggregate([
        { $match: { author: { $in: authors }, dateOfPublish: { $gte: date } } },
        { $group: { _id: '$author', 
                    posts: { $push: { 
                        id: '$id',
                        title: '$title', 
                        author: '$author',
                        body: '$body',
                        dateOfPublish: '$dateOfPublish',
                        photos: '$photos',
                        target: '$target',
                        comments: '$comments',
                        likes: '$likes',
                        dislikes: '$dislikes'
                    } } } }
        ]);
        return recentPosts;
    }
    static async getRecentPostsByAuthorsAndTarget(authors, requestedTarget) {
        const date = new Date();
        date.setDate(date.getDate() - 2);
        const recentPosts = await posts.aggregate([
        { $match: { author: { $in: authors }, target: requestedTarget, dateOfPublish: { $gte: date } } },
        { $group: { _id: '$author', 
                    posts: { $push: { 
                        id: '$id',
                        title: '$title', 
                        author: '$author',
                        body: '$body',
                        dateOfPublish: '$dateOfPublish',
                        photos: '$photos',
                        target: '$target',
                        comments: '$comments',
                        likes: '$likes',
                        dislikes: '$dislikes'
                    } } } }
        ]);
        return recentPosts;
    }
    static async addComment(comment, id){
        const post = await posts.findOne({id});
        post.comments.create(comment);
        return await post.update({comments:post.comments});
    }
    static async editComment(postId, commentId, newBody) {
        const post = await posts.findOne({ id: postId });
        const comment = post.comments.findOne(c => c.commentId === commentId);
        comment.body = newBody;
        return await post.save({ comments: post.comments });   
    }
    static async deleteComment(postId, commentId) {
        const post = await db.posts.findOne({ where: { id: postId } });
        const commentIndex = post.comments.findIndex((c) => c.commentId == commentId);
        post.comments.splice(commentIndex, 1);
        await post.save();
        return post;
            
    }      
    static async addLike(postId) {
        const post = await posts.findOne({ id: postId });
        post.likes += 1;
        return await post.update({ likes: post.likes });
    }

    static async removeLike(postId) {
        const post = await posts.findOne({ id: postId });
        if (post.likes > 0) {
            post.likes -= 1;
        }
        return await post.update({ likes: post.likes });
    }

    static async addDislike(postId) {
        const post = await posts.findOne({ id: postId });
        post.dislikes += 1;
        return await post.update({ dislikes: post.dislikes });
    }

    static async removeDislike(postId) {
        const post = await posts.findOne({ id: postId });
        if (post.dislikes > 0) {
            post.dislikes -= 1;
        }
        return await post.update({ dislikes: post.dislikes });
    }
    static async addReport(id, totalReports) {
        const post = await posts.findOne({ id });
        post.reports += totalReports;
        return await post.update({ reports: post.reports });
    }
    static async getReportedPosts() {
        const reportedPosts = await posts.findAll({where: {reports: { $gt: 0 }}, order: [['reports', 'DESC']]});
        return reportedPosts;
    }
      
}