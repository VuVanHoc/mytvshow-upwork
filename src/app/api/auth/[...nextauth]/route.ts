import { signInService } from "@/services/user.service";
import { COOKIES } from "@/utils/constants";
import { setCookie } from "cookies-next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			id: "credentials",
			name: "Credentials",
			credentials: {
				username: {
					label: "Username",
					type: "text",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				try {
					const response = await signInService({
						username: credentials?.username || "",
						password: credentials?.password || "",
					});

					return {
						id: response.id.toString() || "1",
						name: response.username ?? "User",
						email: response.username ?? "User",
					};
				} catch (error) {
					throw new Error("Invalid username or password");
				}
			},
		}),
	],

	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (user) {
				// Optionally, set a custom cookie here if needed
				setCookie(COOKIES.ACCESSTOKEN, "your_custom_token", {
					maxAge: 30 * 24 * 60 * 60,
				});
				return true;
			}
			return false;
		},
		async jwt({ token, user }) {
			// If it's the first time the token is being created, add the user object to it
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			// Add custom properties to the session object

			return { ...session, id: token.id };
		},
	},
	secret: "secret",
	pages: {
		// signIn: "/auth/signin", // Custom sign in page
	},
});
export { handler as GET, handler as POST };
