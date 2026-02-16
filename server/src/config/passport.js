const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    return done(null, user);
                }

                // Create new User - password not required for OAuth
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'google-oauth', // just a placeholder
                    googleId: profile.id,
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

module.exports = passport;