import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/login",
    },
    callbacks: {
        // async signIn({ user, account }) {
        //     console.log("--------- Sign In -----------");
        //     console.log("user = ", user);

        //     if (account?.provider !== "credentials") return true;

        //     return true;
        // },
        async jwt({ token, user }) {
            // console.log("----------- JWT -----------");
            // console.log("token = ", token, "\n user = ", user);

            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.token = user.token;
            }
            return token;
        },
        async session({ token, session }) {
            // console.log("----------- Session -----------");
            // console.log("token = ", token, "\nsession = ", session);

            session.user.id = token.id as string;
            session.user.name = token.name;
            session.user.email = token.email as string;
            session.user.token = token.token as string;
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.JWT_SECRET,
    ...authConfig,
});
