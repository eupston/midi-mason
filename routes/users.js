var express = require('express');
const userController = require('../controllers/users')
const { isAuth } = require("../middleware/auth");

var router = express.Router();


router.get('/', userController.getUsers)

router.post('/', userController.createUser)

router.get("/:id", userController.getUser)

router.put("/:id", userController.updateUser)

router.delete("/:id", userController.deleteUser)

module.exports = router;
