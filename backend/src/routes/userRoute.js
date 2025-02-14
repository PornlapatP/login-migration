const express = require('express') ;
const { getUsers, getUser, addUser, editUser, removeUser, LoginUser, GoogleLogin , googleLogin , googleCallback , getUserProfile, logout } = require('../controllers/userController') ;
const middleware = require('../middleware/auth')
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/',middleware.authenticateToken , getUsers);
router.get('/:id', getUser);
router.post('/register', addUser);
router.put('/:id', editUser);
router.delete('/:id', removeUser);
router.post('/login',LoginUser);
router.post('/google-login',GoogleLogin);


// Create a new employee
router.post('/create/employees',middleware.authenticateToken, employeeController.createEmployee);

// Get all employees
router.get('/get/employees',middleware.authenticateToken,employeeController.getEmployees);

// Get employee by ID
router.get('/employees/:id', employeeController.getEmployeeById);

// Update employee by ID
router.put('/update/employees/:id',middleware.authenticateToken, employeeController.updateEmployee);

// Delete employee by ID
router.delete('/delete/employees/:id',middleware.authenticateToken, employeeController.deleteEmployee);

// router.get('/google/login', googleLogin);
// router.get('/google/callback', googleCallback);
// router.get('/user/profile', middleware.authenticateToken, getUserProfile);
// router.post('/logout', logout);


module.exports = router;
