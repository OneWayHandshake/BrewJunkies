import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './database.js';

export function configurePassport(passport: PassportStatic): void {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_ACCESS_SECRET!,
      },
      async (payload, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: payload.userId },
          });

          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('No email provided by Google'), undefined);
            }

            // Check if user exists with this Google ID
            let user = await prisma.user.findUnique({
              where: { googleId: profile.id },
            });

            if (!user) {
              // Check if email exists (link accounts)
              user = await prisma.user.findUnique({ where: { email } });

              if (user) {
                // Link Google to existing account
                user = await prisma.user.update({
                  where: { id: user.id },
                  data: { googleId: profile.id },
                });
              } else {
                // Create new user
                user = await prisma.user.create({
                  data: {
                    googleId: profile.id,
                    email,
                    name: profile.displayName,
                    avatarUrl: profile.photos?.[0]?.value,
                  },
                });
              }
            }

            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }
}
