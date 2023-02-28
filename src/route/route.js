const express=require('express')
const router=express.Router()
const {body} = require('express-validator');
const Usercontroller = require('../controller/userController')

router.post('/register',[
    body('f_name',"The f_name must be of minimum 3 characters length")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 3 }),
    body('l_name',"The l_name must be of minimum 3 characters length")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 3 }),
    body('email',"Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
], Usercontroller.registerUser)

router.post('/login',[
    body('email',"Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
], Usercontroller.userLogin)


router.get('/getuser',Usercontroller.getUser)



module.exports=router 



