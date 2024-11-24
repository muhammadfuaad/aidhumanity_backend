import { Strategy as LinkedInStrategy, Profile as LinkedInProfile } from 'passport-linkedin-oauth2';
// Uncomment the following line if you plan to use Google Strategy later
// import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { config } from '../config/config';
import passport, { AuthenticateOptions } from 'passport';
import { Request, Response, NextFunction } from 'express';

// Google authentication (Commented out as per your original code)
// passport.use(new GoogleStrategy(
//   {
//     clientID: config.googleClientId as string,
//     clientSecret: config.googleClientSecret as string,
//     callbackURL: "http://www.example.com/auth/google/callback",
//   },
//   async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: (err: any, user?: any) => void) => {
//     try {
//       // Replace with actual database logic
//       const user = await User.findOrCreate({ googleId: profile.id });
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   }
// ));

// Google Authentication Methods
export const googleAuth = (): AuthenticateOptions => {
  return passport.authenticate('google', { scope: ['profile'] });
};

export const googleAuthCallback = (): void => {
  passport.authenticate('google', { failureRedirect: '/login' }),
    (req: Request, res: Response) => {
      res.redirect('/');
    };
};

// LinkedIn Signup Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: config.linkedinClientId as string,
      clientSecret: config.linkedinClientSecret as string,
      callbackURL: 'http://127.0.0.1:3000/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: LinkedInProfile,
      done: (err: any, user?: any) => void
    ) => {
      console.log('LinkedIn profile:', profile);

      process.nextTick(() => {
        try {
          // Replace with actual database logic
          const user = {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails,
          };
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      });
    }
  )
);

// LinkedIn Authentication Methods
export const linkedinAuth = () => {
  return passport.authenticate('linkedin', { state: 'SOME STATE' }); // `state` is optional but recommended for security
};

export const linkedinAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('linkedin', { failureRedirect: '/login' }, (err, user, info) => {
    if (err) {
      console.error('LinkedIn authentication error:', err);
      return res.status(500).json({ error: 'Authentication failed' });
    }
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Success: You can issue a token here or establish a session
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr);
        return res.status(500).json({ error: 'Login failed' });
      }
      // Redirect or respond with user data
      return res.redirect('/dashboard'); // Adjust redirect path as needed
    });
  })(req, res, next);
};
