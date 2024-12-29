import { authOptions } from "@/lib/auth";  // Import authentication options from the auth configuration file
import NextAuth from "next-auth";  // Import the NextAuth function for handling authentication

const handler = NextAuth(authOptions);  // Initialize NextAuth with the provided authentication options

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };