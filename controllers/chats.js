const {response} = require('express');
const chatsDAO = require('../dao/chatsDAO');

const createChatPost = async (req, res = response) =>{
    const{usernameFrom, usernameTo, newMessage, date} = req.body;
    try{
        const participants = [{username:usernameFrom},{username:usernameTo}];
        const message = {username:usernameFrom, message:newMessage, dateOfMessage:date};
        const chat = {participants, message};
        const newChat = await chatsDAO.startNewChat(chat);
        res.status(201).json(newChat);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"We were unable to create the chat, please try again later.", error})
    }
}
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
const getMessages = async (req, res = response) =>{
    const{usernameFrom, usernameTo} = req.body;
    try{
        const participants = [{username:usernameFrom},{username:usernameTo}];
        const chat = await chatsDAO.getMessagesByDate(participants);
        const validated = await validateChat(chat, res);
        res.status(200).json({chat: validated});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "We were unable to retrieve the messages at this time, please try again later.", error})
    }
}
const validateChat = (chat, res) =>{
    return new Promise((resolve, reject) =>{
        if (chat != null){
            resolve(chat);
        }else{
            reject(res.status(404).json({message:'Chat does not exist'}))
        }
    })
}
module.exports = {
    createChatPost,
    addNewMessagePut,
    getMessages
};