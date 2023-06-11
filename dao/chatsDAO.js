const mongoose = require ('mongoose')
const config = require ('../config/config.json')
const chatSchema = mongoose.Schema({
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
});
const chats = mongoose.model('chats', chatSchema);
mongoose.connect(config.development.database.url);

class chatsDAO{
    static async startNewChat(newChat) {
      const { participants } = newChat;
      const sortedParticipants = participants.map(({ username }) => username).sort();
      const chatExistent = await chats.findOne({$and: [
      { 'participants.username': sortedParticipants[0] },
      { 'participants.username': sortedParticipants[1] }]});
      if (chatExistent == null) {
        const chat = new chats(newChat);
        return await chat.save();
      }else{
        throw new Error(`Chat with participants ${JSON.stringify(participants)} alredy exists`);
      }
    }
    static async addMessageToChat(newChat) {
      const { participants, message } = newChat;
      const sortedParticipants = participants.map(({ username }) => username).sort();
      const chatExistent = await chats.findOne({$and: [
      { 'participants.username': sortedParticipants[0] },
      { 'participants.username': sortedParticipants[1] }]});
      if (chatExistent) {
          chatExistent.messages.push(message);
          await chatExistent.save();
          return chatExistent;
      } else {
          throw new Error(`Chat with participants ${JSON.stringify(participants)} not found.`);
      }
    }
    static async getMessagesByDate(participants) {
      const sortedParticipants = participants.map(({ username }) => username).sort();
      const chat = await chats.find({
        $and: [
          { 'participants.username': sortedParticipants[0] },
          { 'participants.username': sortedParticipants[1] }
        ]
      });

      if (!chat || chat.length === 0) {
        throw new Error(`Chat with participants ${JSON.stringify(participants)} not found.`);
      }
      chat[0].messages.sort((a, b) => a.dateOfMessage - b.dateOfMessage);

      return chat[0].messages;
    }





}
module.exports = chatsDAO;