const {response} = require('express');
const chatsDAO = require('../dao/chatsDAO');
/**
 * @swagger
 * /createchat/:
 *  post:
 *    summary: create new chat
 *    tags : [Chats]
 *    requestBody:
 *      required.true
 *    content:
 *      usernameFrom:
 *        type: String
 *        description: the username user to send message
 *      usernameTo:
 *        type: String
 *        description: the username user to recive message
 *      newMessage:
 *        type: String
 *        description: contain body of message
 *      date:
 *        type: date
 *        description: date of send message
 *    responses:
 *      201:
 *        description: get chat
 *      500:
 *        description: error server
 */
const createChatPost = async (req, res = response) => {
    const { usernameFrom, usernameTo, newMessage, date } = req.body;
    try {
      const participants = [{ username: usernameFrom }, { username: usernameTo }];
      const message = { username: usernameFrom, message: newMessage, dateOfMessage: date };
      const chat = { participants, messages: [message] }; 
      const newChat = await chatsDAO.startNewChat(chat);
      res.status(201).json(newChat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "We were unable to create the chat, please try again later.", error: error.toString() });
    }
  }  
/**
 * @swagger
 * /createchat/:
 *  put:
 *    summary: Insert a new message
 *    tags : [Chats]
 *    requestBody:
 *      required.true
 *    content:
 *      usernameFrom:
 *        type: String
 *        description: the username user to send message
 *      usernameTo:
 *        type: String
 *        description: the username user to recive message
 *      newMessage:
 *        type: String
 *        description: contain body of message
 *      date:
 *        type: date
 *        description: date of send message
 *    responses:
 *      201:
 *        description: get chat
 *      500:
 *        description: error server
 */
const addNewMessagePut = async (req, res = response) =>{
    const{usernameFrom, usernameTo, newMessage, date} = req.body;
    try{
        const participants = [{username:usernameFrom},{username:usernameTo}];
        const message = {username:usernameFrom, message:newMessage, dateOfMessage:date};
        const chat = {participants, message};
        const newChat = await chatsDAO.addMessageToChat(chat);
        res.status(200).json(newChat);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"We were unable to send message, please try again later.", error})
    }
}
/**
 * @swagger
 * /createchat/:
 *  post:
 *    summary: get chat
 *    tags : [Chats]
 *    requestBody:
 *      required.true
 *    content:
 *      usernameFrom:
 *        type: String
 *        description: the username user to send message
 *      usernameTo:
 *        type: String
 *        description: the username user to recive message
 *    responses:
 *      201:
 *        description: get chat
 *      500:
 *        description: error server
 */
const getMessages = async (req, res = response) => {
    const { usernameFrom, usernameTo } = req.body;
    try {
      const participants = [{ username: usernameFrom }, { username: usernameTo }];
      const chat = await chatsDAO.getMessagesByDate(participants);
      res.status(200).json({ chat });
    } catch (error) {
      console.error(error);
      if (error.message.startsWith('Chat with participants')) {
        res.status(404).json({ message: 'Chat does not exist', error: error.toString() });
      } else {
        res.status(500).json({message:'We were unable to retrieve the messages at this time, please try again later.',error: error.toString()});
      }
    }
  };  
  
  const validateChat = (chat) => {
    return new Promise((resolve, reject) => {
      if (chat !== null) {
        resolve(chat);
      } else {
        reject();
      }
    });
  };
  
module.exports = {
    createChatPost,
    addNewMessagePut,
    getMessages
};