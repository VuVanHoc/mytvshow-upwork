import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: "secret",
	});

	if (!token) {
		return NextResponse.redirect(new URL("/api/auth/signin", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
