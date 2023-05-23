'use strict';
module.exports = mongoose => {
  const newSchema = new mongoose.Schema({
    id:{
      type: Number,
      unique: true
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
        type: String
      }
    }],
    target: {
      type: String
    },
    comments: [{
      commentId:{
        type: Number,
        unique: true
      },
      author: {
        type: String
      },
      body: {
        type: String
      },
      dateOfComment: {
        type: Date
      }
    }],
    likes: {
      type: Number
    },
    dislikes: {
      type: Number
    },
    reports: {
      type: Number
    }
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
  newSchema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
      mongoose.model('Post', newSchema)
      .findOne({}, {}, { sort: { 'id': -1 } })
      .exec()
      .then((lastDocument) => {
        if (lastDocument) {
          doc.id = lastDocument.id + 1;
        } else {
          doc.id = 1;
        }
        next();
      })
      .catch((err) => {
        next(err);
      });
    } else {
      next();
    }
  });

  newSchema.pre('save', function (next) {
    const doc = this;
    doc.comments.forEach(comment => {
      if (comment.isNew) {
        mongoose.model('Post', newSchema)
        .findOne({}, {}, { sort: { 'comments.commentId': -1 } })
        .exec()
        .then((lastDocument) => {
          let lastCommentID = 1;
          if (lastDocument && lastDocument.comments.length > 0) {
            const lastComment = lastDocument.comments.find(c => c.commentId);
            if (lastComment) {
              lastCommentID = lastComment.commentId + 1;
            }
          }
          comment.commentId = lastCommentID;
          next();
        })
        .catch((err) => {
          next(err);
        });
      }
    });
    next();
  });

  const Post = mongoose.model('Post', newSchema);
  return Post;
};