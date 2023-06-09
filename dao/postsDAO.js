'use strict';
const mongoose = require ('mongoose');
const config = require('../config/config.json')
const shortid = require('shortid');
const postSchema = mongoose.Schema({
  id:{
    type: String,
  },
  title: {
    type: String
  },
  author: {
    type: String
  },
  body: {
    type: String
  },
  dateOfPublish: {
    type: Date
  },
  photos: [{
    url: {
      type: String,
      required: false
    }
  }],
  target: {
    type: String
  },
  comments: [{
    commentId:{
      type: String, 
      required: false
    },
    author: {
      type: String,
      required: false
    },
    body: {
      type: String,
      required: false
    },
    dateOfComment: {
      type: Date,
      required: false
    }
  }],
  likes: {
    type: Number,
    required: false
  },
  dislikes: {
    type: Number,
    required: false
  },
  reports: {
    type: Number,
    required: false
  }
});

const posts = mongoose.model('posts', postSchema)
mongoose.connect(config.development.database.url);
class postsDAO{
    static async addNewPost(post){
      const newId = shortid.generate();
      post.id = newId;
      post.likes = 0; 
      post.dislikes = 0; 
      post.reports = 0;
      return await posts.create(post);
    }
    static async editPost(post, id){
        const updatedPost = await posts.findOneAndUpdate({ id }, post, { new: true });
        return updatedPost;
    }
    static async deletePost(id){
        return await posts.deleteOne({ id: id.id });
    }
    static async getPostsByAuthor(author) {
      const allPosts = await posts.find({ author: author.author }).sort({ dateOfPublish: 'desc' });
      return allPosts;
    }
    static async getPostByIdAndTitle(id, title){
        const post = await posts.find({id: id, title: title});
        return post
    }
    static async getRecentPostsByAuthors(authors) {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const recentPosts = await posts.aggregate([
        { $match: { author: { $in: authors }, dateOfPublish: { $gte: date } } },
        { $sort: {likes: -1, dateOfPublish: -1, dislikes: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            title: 1,
            author: 1,
            body: 1,
            dateOfPublish: 1,
            photos: 1,
            target: 1,
            comments: 1,
            likes: 1,
            dislikes: 1,
          },
        },
      ]);
      return recentPosts;
    }    
    static async getRecentRandomPostsByTarget(target) {
      const everybody = "EVERYBODY";
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const recentPosts = await posts.aggregate([
        { $match: { $or: [{ target: { $regex: `.*${target}.*` } }, { target: { $regex: `.*${everybody}.*` } }], dateOfPublish: { $gte: date } } },
        { $sort: {likes: -1, dateOfPublish: -1, dislikes: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            title: 1,
            author: 1,
            body: 1,
            dateOfPublish: 1,
            photos: 1,
            target: 1,
            comments: 1,
            likes: 1,
            dislikes: 1,
          },
        },
      ]);
      return recentPosts;
    }      
    static async getRecentPostsByAuthorsAndTarget(authors, requestedTarget) {
      const date = new Date();
      date.setDate(date.getDate() - 5);
      const recentPosts = await posts.aggregate([
        { $match: { author: { $in: authors }, target: requestedTarget, dateOfPublish: { $gte: date } } },
        { $sort: {likes: -1, dateOfPublish: -1, dislikes: 1 } },
        {
          $project: {
            _id: 0,
            id: 1,
            title: 1,
            author: 1,
            body: 1,
            dateOfPublish: 1,
            photos: 1,
            target: 1,
            comments: 1,
            likes: 1,
            dislikes: 1,
          },
        },
      ]);
      return recentPosts;
    }       
    static async addComment(comment, id) {
      const post = await posts.findOne({ id });
      const newId = shortid.generate();
      comment.commentId = newId;
      post.comments.push(comment); 
      return await post.save();
    }
    static async editComment(postId, commentId, newBody) {
      const post = await posts.findOne({ id: postId });
      const commentIndex = post.comments.findIndex(c => c.commentId === commentId);
      post.comments[commentIndex].body = newBody;
      return await post.save();
    }
    
    static async deleteComment(postId, commentId) {
      const post = await posts.findOne({ id: postId });
      const commentIndex = post.comments.findIndex((c) => c.commentId == commentId);
      post.comments.splice(commentIndex, 1);
      await post.save();
      return post;
    }
         
    static async addLike(postId) {
      const post = await posts.findOne({ id: postId.id });
      if (!isNaN(post.likes)) {
        post.likes += 1;
      } else {
        post.likes = 1;
      }
      await post.save();
      return post;
    }
    
    static async removeLike(postId) {
      const post = await posts.findOne({ id: postId.id });
      if (!isNaN(post.likes) && post.likes > 0) {
        post.likes -= 1;
      }
      await post.save();
      return post;
    }
    
    static async addDislike(postId) {
      const post = await posts.findOne({ id: postId.id });
      if (!isNaN(post.dislikes)) {
        post.dislikes += 1;
      } else {
        post.dislikes = 1;
      }
      await post.save();
      return post;
    }
    
    static async removeDislike(postId) {
      const post = await posts.findOne({ id: postId.id });
      if (!isNaN(post.dislikes) && post.dislikes > 0) {
        post.dislikes -= 1;
      }
      await post.save();
      return post;
    }
    
    static async addReport(postId, totalReports) {
      const post = await posts.findOne({ id : postId });
      if (!isNaN(post.reports)) {
        post.reports += totalReports;
      } else {
        post.reports = totalReports;
      }
      await post.save();
      return post;
    }    
    
    static async getReportedPosts() {
      const reportedPosts = await posts.find({ reports: { $gt: 0 } }).sort({ reports: -1 });
      return reportedPosts;
    }
}
module.exports = postsDAO;