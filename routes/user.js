const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

const router = express.Router();
const User = require('../model/User');
/**
 * @method - POST
 * @description - User Signup
 * @param - /user/signup
 */

router.post('/signup', [
    check('username', 'Please enter a valid Username').not().isEmpty(),
    check('email', 'Please enter a valid email').not().isEmpty(),
    check('password', 'Please enter a valid password').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ msg: 'User Already Exists'});
        }

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: { id: user.id }
        };

        jwt.sign(payload, "randomString", {
            expiresIn: 10000
        }, (err, token) => {
            if(err) throw err;
            res.status(200).json({ token });
        })

    } catch (e) {
        console.log(err.message);
        res.status(500).send('Error in saving..');
    }
});

/**
 * @method - POST
 * @description - Get Logged User
 * @param - /user/login
 */
router.post('/login', [
    check('email', 'Please enter email').not().isEmpty(),
    check('password', 'Please enter a valid password').isLength({ min: 6 })
], async (req, res) => {
     const errors = validationResult(req);

     if(!errors.isEmpty()) {
         return res.status(400).json({
             errors: errors.array()
         });
     }


     const { email, password } = req.body;

     try {
        let user = await User.findOne({ email });
        // console.log(user);

        if(!user) {
            return res.status(400).json({
                message: "User not Exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }

        const payload = {
            user: { id: user.id }
        };
        // console.log(payload.user);

        jwt.sign(payload, 'randomString', {
            expiresIn: 3000
        }, (err, token) => {
            if(err) throw err;
            res.status(200).json({ token });
        });
     } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Server Error'
        });
     }
}); 

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */
router.post('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({
            message: 'Error in Fetching user...'
        });
    }
});

module.exports = router;