'use strict';
module.exports = mongoose => {
  const newSchema = new mongoose.Schema({
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
        type: String
      }
    }],
    target: {
      type: String
    },
    comments: [{
      author: {
        type: String
      },
      body: {
        type: String
      },
      dateOfComment: {
        type: String
      }
    }],
    likes: {
      type: Number
    },
    dislikes: {
      type: Number
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
  const Post = mongoose.model('Post', newSchema);
  return Post;
};