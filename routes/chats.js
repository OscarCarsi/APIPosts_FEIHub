const{Router} = require('express');
const {
    createChatPost,
    addNewMessagePut,
    getMessages
} = require ('../controllers/chats');
const router = Router();
router.post('/createChat', createChatPost);
router.put('/addNewMesagePut', addNewMessagePut);
router.get('/getChat', getMessages);
module.exports = router;
