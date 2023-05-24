'use strict';
module.exports = mongoose => {
  const newSchema = new mongoose.Schema({
    participants: [{
      username: {
        type:String
      }
    }],
    messages: [{
      username:{
        type:String
      },
      message:{
        type:String
      },
      dateOfMessage:{
        type:Date
      }
    }]
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
  newSchema.pre('create', function (next) {
    const doc = this;
    if (doc.isNew) {
      mongoose.model('chats', newSchema)
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
  const Chats = mongoose.model('chats', newSchema);
  return Chats;
};