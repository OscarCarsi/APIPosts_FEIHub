const {chats} = require ('../models');
class chatsDAO{
    static async startNewChat(participants, messages){
        const chat = await chats.findOne({ participants });
        if (!chat) {
            const newChat = new chats({ participants, messages });
            return await chats.create(newChat);
        }
    }
    static async addMessageToChat(participants, messages) {
        const chat = await chats.findOne({ participants });
        if (chat) {
            chat.messages.push(messages); 
            await chat.save();
            return chat;
        } else {
            throw new Error(`Chat with participants ${JSON.stringify(participants)} not found.`);
        }
    }
    static async getMessagesByDate(participants) {
        const chat = await Chat.findOne({ participants });
        if (chat) {
          const sortedMessages = chat.messages.sort((a, b) => b.dateOfMessage - a.dateOfMessage);
          return sortedMessages;
        } else {
          throw new Error(`Chat with participants ${JSON.stringify(participants)} not found.`);
        }
    }

}