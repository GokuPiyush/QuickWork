const passport = require("passport");
const Google = require("passport-google-oauth20").Strategy;
const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = require('./credetials');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user))
// authentication strategy
passport.use(
    new Google(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: REDIRECT_URI,
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, {'accessToken': accessToken, 'refreshToken': refreshToken, 'profile': profile});
        }
    )
);
