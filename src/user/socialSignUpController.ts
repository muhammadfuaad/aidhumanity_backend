// const GoogleStrategy = require('passport-google-oauth20').Strategy;
import GoogleStrategy from 'passport-google-oauth20'
import LinkedInStrategy from 'passport-linkedin-oauth2';
import {config} from '../config//config'
import passport from 'passport';

// google signup
// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


// export const googleAuth = () => {
//   passport.authenticate('google', { scope: ['profile'] })
// }

// export const googleAuthCallback = () => {
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });
// }

// linkedin signup

passport.use(new LinkedInStrategy({
  clientID: config.linkedinClientId,
  clientSecret: config.linkedinClientSecret,
  callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile'],
}, function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    // To keep the example simple, the user's LinkedIn profile is returned to
    // represent the logged-in user. In a typical application, you would want
    // to associate the LinkedIn account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}));
  