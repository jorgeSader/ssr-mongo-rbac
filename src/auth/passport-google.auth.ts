import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "dotenv";
import { User } from "../models/user.model.js";

import './passport-settings.auth.js';

env.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});


passport.use(
  new GoogleStrategy({
    // Option for Google Strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }, async (accessToken, refreshToken, profile, done) => {
    console.log("🚀 ~ file: passport-google.auth.ts:28 ~ profile:", profile);
    // Passport callback function
    try {
      // Check if email is already registered
      const currentUser = await User.findOne({ email: profile.emails![0].value });
      if (currentUser) {
        // if email has already been registered check for a googleId.
        if (currentUser.googleId) {
          // If user has googleID, return user
          console.log("🚀 ~ file: passport-google.auth.ts:26 ~ currentUser:", currentUser);
          done(null, currentUser);
        } else {
          // if there is no googleId, update user with google info, save, and return updated user
          currentUser.googleId = profile.id;
          currentUser.firstName = profile.name?.givenName;
          currentUser.lastName = profile.name?.familyName;
          currentUser.imageUrl = currentUser.imageUrl || profile.photos![0].value || '../../public/avatar-1577909.svg';

          const updatedUser = await currentUser.save();
          console.log("🚀 ~ file: passport-google.auth.ts:34 ~ updatedUser:", updatedUser);
          done(null, updatedUser);
        }
        // if no user exists with that email, create, save, and return new user
      } else {
        const user = new User({
          googleId: profile.id,
          email: profile.emails![0].value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          imageUrl: profile.photos![0].value || '../../public/avatar-1577909.svg',
        });

        const newUser = await user.save();
        console.log("🚀 ~ file: passport-google.auth.ts:46 ~ newUser:", newUser);
        done(null, newUser);
      }
    } catch (error) {
      done(error);
    }
  })
);

