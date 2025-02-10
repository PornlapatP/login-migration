const express = require('express') ;
const { getUsers, getUser, addUser, editUser, removeUser, LoginUser, GoogleLogin , googleLogin , googleCallback , getUserProfile, logout } = require('../controllers/userController') ;
const middleware = require('../middleware/auth')
const router = express.Router();

router.get('/',middleware.authenticateToken , getUsers);
router.get('/:id', getUser);
router.post('/register', addUser);
router.put('/:id', editUser);
router.delete('/:id', removeUser);
router.post('/login',LoginUser);
router.post('/google-login',GoogleLogin);

// router.get('/google/login', googleLogin);
// router.get('/google/callback', googleCallback);
// router.get('/user/profile', middleware.authenticateToken, getUserProfile);
// router.post('/logout', logout);


module.exports = router;
