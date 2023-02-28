const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const db = require('../db.js').promise();

const registerUser = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const [row] = await db.query(
            "SELECT `email` FROM `users` WHERE `email`=?",
            [req.body.email]
        );

        if (row.length > 0) {
            return res.status(400).json({
                message: "please input diffrent email id",
            });
        }

        const hashPass = await bcrypt.hash(req.body.password, 12);

        const [rows] = await db.query('INSERT INTO `users`(`f_name`,`l_name`,`email`,`password`) VALUES(?,?,?,?)', [
            req.body.f_name,
            req.body.l_name,
            req.body.email,
            hashPass
        ]);

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "user has been created successfully ",
            });
        }
    } catch (err) {
        next(err);
    }
}



const userLogin = async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {

        const [row] = await db.query(
            "SELECT * FROM `users` WHERE `email`=?",
            [req.body.email]
        );

        if (row.length === 0) {
            return res.status(400).json({
                message: "Invalid email id",
            });
        }

        const Checkpass = await bcrypt.compare(req.body.password, row[0].password);
        if (!Checkpass) {
            return res.status(400).json({
                message: "Incorrect password",
            });
        }
        const Token = jwt.sign({ id: row[0].id }, 'secrect-key', { expiresIn: '30min' });
        return res.json({ token: Token });
    }
    catch (err) {
        next(err);
    }
}

const getUser = async function (req, res, next) {
    try {

        if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer') ||
            !req.headers.authorization.split(' ')[1]
        ) {
            return res.status(400).json({
                message: "Please provide the token",
            });
        }

        const Token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(Token, 'secrect-key');

        const [row] = await db.query(
            "SELECT `id`,`f_name`,`l_name`,`email` FROM `users` WHERE `id`=?",
            [decoded.id]
        );

        if (row.length > 0) {
            return res.json({
                user: row[0]
            });
        } res.json({
            message: "No user found"
        });
    }
    catch (err) {
        next(err);
    }
}

module.exports = { registerUser, userLogin, getUser }

