var express = require('express');
const authController = require('../controllers/auth');
const {isAuth}= require('../middleware/auth');

var router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", isAuth, authController.logout);
router.post("/email", authController.postEmail);

router.put("/update", isAuth, authController.update);
router.put("/updatepassword", isAuth, authController.updatePassword);
router.post("/forgotpassword", authController.forgotPassword);
router.put("/resetpassword/:resettoken", authController.resetPassword);



module.exports = router;
