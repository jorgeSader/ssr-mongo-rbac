// import passport from 'passport';
// import LocalStrategy from 'passport-local';
// import { User, IUser } from '../models/user.model.js';
// 
// passport.use(
//   new LocalStrategy.Strategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password'
//     },
//     async (email, password, done) => {
//       console.log("🚀 ~ file: passport.auth.ts:12 ~ email:", email);
//       console.log("🚀 ~ file: passport.auth.ts:12 ~ password:", password);
//       try {
//         const user = await User.findOne({ email });
//         console.log("🚀 ~ file: passport.auth.ts:16 ~ user:", user);
//         if (!user) {
//           return done(null, false, { message: "User/Email not found." });
//         }
// 
//         const isMatch = await user.isValidPassword(password);
//         console.log("🚀 ~ file: passport.auth.ts:22 ~ isMatch:", isMatch);
//         return !isMatch
//           ? done(null, false, { message: "Incorrect Username or Password." })
//           : done(null, user);
// 
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );
// 
// passport.serializeUser(function (user, done) {
//   console.log("🚀 ~ file: passport.auth.ts:35 ~ user.id:", user.id);
//   done(null, user.id);
// });
// 
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     console.log("🚀 ~ file: passport.auth.ts:41 ~ deserializeUser:", user);
//     done(err, user);
//   });
// });
