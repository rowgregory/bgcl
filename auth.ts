import prisma from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
// import { Resend } from "resend";
// import magicLinkTemplate from "./app/lib/email-templates/magic-link";
import { createLog } from "./app/lib/api/createLog";
import { Role } from "@prisma/client";

// const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Links Google account to existing email
    }),
    // {
    //   id: "email",
    //   name: "Email",
    //   type: "email",
    //   maxAge: 15 * 60,
    //   from: process.env.RESEND_FROM_EMAIL!,
    //   sendVerificationRequest: async ({ identifier: email, url, provider }) => {
    //     try {
    //       const result = await resend.emails.send({
    //         from: `BGCL Portal <${provider.from!}>`,
    //         to: email,
    //         subject: "Your BGCL Portal Login Link",
    //         html: magicLinkTemplate(url),
    //       });

    //       await createLog("info", "Magic link sent successfully", {
    //         email,
    //         result,
    //       });
    //     } catch (error) {
    //       await createLog("error", "Failed to send magic link", {
    //         email,
    //         error: error instanceof Error ? error.message : "Unknown error",
    //       });
    //       throw error;
    //     }
    //   },
    // },
  ],

  callbacks: {
    async signIn({ user, account, email: emailData }) {
      if (emailData?.verificationRequest) {
        return true;
      }

      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            parent: true,
            youth: true,
            staff: true,
            admin: true,
          },
        });

        if (!dbUser) {
          await createLog("warn", "Sign-in attempt by non-registered user", {
            email: user.email,
            provider: account?.provider,
          });
          return false;
        }

        // Check if user has login access enabled
        if (!dbUser.hasLoginAccess) {
          await createLog(
            "warn",
            "Sign-in attempt by user without login access",
            {
              userId: dbUser.id,
              email: user.email,
              role: dbUser.role,
            }
          );
          return false;
        }

        // Update last login
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            lastLoginAt: new Date(),
            emailVerified: new Date(),
          },
        });

        await createLog("info", "Successful user sign-in", {
          userId: dbUser.id,
          email: user.email,
          role: dbUser.role,
          provider: account?.provider,
        });

        return true;
      } catch (error) {
        await createLog("error", "Sign-in callback error", {
          email: user.email,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
              parent: true,
              youth: true,
              staff: true,
              admin: true,
            },
          });

          if (dbUser) {
            token.userId = dbUser.id;
            token.role = dbUser.role as Role;

            // Get name from appropriate model
            if (dbUser.parent) {
              token.name = `${dbUser.parent.firstName} ${dbUser.parent.lastName}`;
            } else if (dbUser.youth) {
              token.name = `${dbUser.youth.firstName} ${dbUser.youth.lastName}`;
            } else if (dbUser.staff) {
              token.name = `${dbUser.staff.firstName} ${dbUser.staff.lastName}`;
            } else if (dbUser.admin) {
              token.name = `${dbUser.admin.firstName} ${dbUser.admin.lastName}`;
            }
          }
        } catch (error) {
          await createLog("error", "JWT callback error", {
            email: user.email,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.userId && typeof token.userId === "string") {
        session.user.id = token.userId;
        session.user.role = token.role as Role;
      } else {
        await createLog("error", "Session callback error - missing userId", {
          email: session.user.email,
        });
      }

      return session;
    },
  },
});
