const jwt = require("jsonwebtoken");
const Router = require("express").Router();
const router = new Router();

const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");



/** POST /login - login: {username, password} => {token}
 * 
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if ( await User.authenticate(username, password)) {
            const token = jwt.sign({ username }, SECRET_KEY );
            return res.json({ msg: `Logged in!!`, token})
        } else {
            throw new ExpressError(`Invalid username / password`, 400);
        }
    } catch(e) {
        return next(e);
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {
    try {
        const { username } = req.body;
        const token = jwt.sign({ username }, SECRET_KEY );
        User.updateLoginTimestamp(username);
        return res.json({token}); 

    } catch(e) {
        return next(e);
    }
});
