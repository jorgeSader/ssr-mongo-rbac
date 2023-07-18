import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User, IUser } from '../src/models/user.model';

passport.use(new LocalStrategy.Strategy(async function (email, password, done) {
  try {
    const user = await User.findOne().where({ email });
    if (!user) {
      return done(null, false, { message: "User/Email not found." });
    }

    const isMatch = await user.isValidPassword(password);
    return isMatch
      ? done(null, user)
      : done(null, false, { message: "Incorrect Password." });

  } catch (error) {
    done(error);
  }
}));

// =============================Youtube Yours Truly======================================
// passport.use(
//   new LocalStrategy({
//     usernameField: "email",
//     passwordField: "password"
//   }, async (email, password, done) => {
//     try {
//       const user = await User.findOne({ email });
//       if (!user) {
//         return done(null, false, { message: "User/Email not registered." });
//       }
// 
//       const isMatch = await user.isValidPassword(password);
//       return isMatch
//         ? done(null, user)
//         : done(null, false, { message: "Incorrect Password." });
// 
//     } catch (error) {
//       done(error);
//     }
//   })
// );

//
// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });
// 
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });