const {chats} = require ('../models');
class chatsDAO{
    static async startNewChat(newChat){
        const chatExistent = await chats.findOne(newChat.participants);
        if (!chatExistent) {
            const chat = new chats({ participants, messages });
            return await chats.create(chat);
        }
    }
    static async addMessageToChat(newChat) {
        const chatExistent = await chats.findOne(newChat.participants);
        if (chatExistent) {
            chatExistent.messages.push(messages); 
            await chatExistent.save();
            return chatExistent;
        } else {
            throw new Error(`Chat with participants ${JSON.stringify(participants)} not found.`);
        }
    }
    static async getMessagesByDate(participants) {
        const chat = await chats.findOne({ participants });
        if (chat) {
          const sortedMessages = chat.messages.sort((a, b) => b.dateOfMessage - a.dateOfMessage);
          return sortedMessages;
        } else {
          throw new Error(`Chat with participants ${JSON.stringify(participants)} not found.`);
        }
    }

}
module.exports = chatsDAO;