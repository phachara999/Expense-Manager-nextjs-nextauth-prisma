//create middleware function  in next js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// export async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   // If the user is not logged in and is not on the login page, redirect to the login page
//   if (!token) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // Allow the request to continue if the user is logged in or is on the login page
//   return NextResponse.next();
// }
export default withAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
    verifyRequest: '/auth/login',
  },
});