import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/backend/models/user";
import bcrypt from "bcryptjs";
import connectDB from "@/backend/config/connectDB";

export const authOptions = {
    providers: [
      CredentialsProvider({
        async authorize(credentials) {
          const { email, password } = credentials;
          try{
            await connectDB();
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
              throw new Error("Invalid Email or Password");
            }
            const isPasswordMatched = await bcrypt.compare(
              password,
              user.password
              );
              if (!isPasswordMatched) {
                throw new Error("Invalid Email or Password");
              }
    
              return user;
          }catch(error) {
            console.log("Error: ", error);
          }
        },
      }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        user && (token.user = user);

        return token;
      },
      session: async ({ session, token }) => {
        session.user = token.user;

        // delete password from session
        delete session?.user?.password;

        return session;
      },
    },
    secret: "asdadadasfafasfaa",
    pages: {
      signIn: "/login",
    },
  };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };