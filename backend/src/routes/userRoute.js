const express = require('express') ;
const { getUsers, getUser, addUser, editUser, removeUser, LoginUser } = require('../controllers/userController') ;
const middleware = require('../middleware/auth')
const router = express.Router();

router.get('/',middleware.authenticateToken , getUsers);
router.get('/:id', getUser);
router.post('/', addUser);
router.put('/:id', editUser);
router.delete('/:id', removeUser);
router.post('/login',LoginUser)

module.exports = router;
