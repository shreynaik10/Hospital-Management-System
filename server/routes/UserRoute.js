const express = require("express");
const router = express.Router();
const adminAuth = require('./middlewares/adminAuth');

const {
    getUsers,
    getUserById,
    saveUser,
    updateUser,
    deleteUser
} = require('../controllers/UserController.js')



router.get('/users', adminAuth, getUsers);
router.get('/users/:id', adminAuth, getUserById);
router.post('/users', adminAuth, saveUser);
router.patch('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

module.exports = router