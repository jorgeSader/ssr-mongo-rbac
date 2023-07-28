import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import env from "dotenv";
import { User } from "../models/user.model.js";

env.config();

passport.use(
  new GoogleStrategy.Strategy({
    // Option for Google Strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }, async (accessToken, refreshToken, profile, done) => {
    console.log("🚀 ~ file: google-passport.auth.ts:15 ~ profile:", profile);
    // Passport callback function
    try {
      // check if user exists
      const currentUser = await User.findOne({ email: profile.emails[0].value });
      if (currentUser) {
        if (currentUser.googleId) {
          console.log("existing user: ", currentUser);
        } else {
          const user = {
            ...currentUser,
            googleId: profile.id,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            imageUrl: profile.photos[0].value || '../../public/avatar-1577909.svg',
          };
          const updatedUser = await user.save();
          console.log("Updated user: ", updatedUser);
        }
      } else {
        const user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          imageUrl: profile.photos[0].value || '../../public/avatar-1577909.svg',
        });

        const newUser = await user.save();
        console.log("New user: ", newUser);
      }
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
