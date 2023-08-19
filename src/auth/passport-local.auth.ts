import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model.js';


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).populate('account').then((user) => {
    done(null, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).populate('account');
        if (!user) {
          return done(null, false, { message: "User/Email not found." });
        }

        const isMatch = await user.isValidPassword(password);
        return isMatch
          ? done(null, user)
          : done(null, false, { message: "Incorrect Username or Password." });

      } catch (error) {
        done(error);
      }
    }
  )
);

