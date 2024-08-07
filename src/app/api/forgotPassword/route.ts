// app/api/signup/route.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { username, password } = await req.json();

	if (!username || !password) {
		return new Response(
			JSON.stringify({ error: "Username and password are required" }),
			{ status: 400 },
		);
	}

	try {
		// Check if the username already exists
		const existingUser = await prisma.user.findFirst({
			where: { username: username },
		});

		if (!existingUser) {
			return new Response(
				JSON.stringify({ error: "Username not found" }),
				{ status: 409 },
			);
		}

		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "vanhoc.amazingyou@gmail.com",
				pass: "aewq eesz guji btzx",
			},
		});

		const mailOptions = {
			from: "vanhoc.amazingyou@gmail.com",
			to: existingUser.email,
			subject: `RESET YOUR PASSWORD ON MYTVSHOW WEBSITE`,
			html: `
				<img src="https://mytvshow-upwork.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.b609437e.jpg&w=256&q=75" alt="" width="180px" height="43px"/>
				<p>You requested to reset your password on <a href="https://mytvshow-upwork.vercel.app" target="_blank">MyTVShows</a>.</p>
				<ul>
					<li>Username: <b>${username}</b></li>
					<li>New Password: ${password}</li>
				</ul>
                <p>Please click the link below to confirm your change.</p>
                <a href="https://mytvshow-upwork.vercel.app/api/forgotPassword?username=${username}&password=${password}" target="_blank">Confirm now</a>
			`,
		};
		try {
			await transporter.sendMail(mailOptions);
			return new Response(
				JSON.stringify({
					message: "Request reset password successfully",
				}),
				{ status: 201 },
			);
		} catch (error) {
			console.error("Error sending email:", error);
			return NextResponse.json(
				{ message: "Failed to send email" },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: "Error reset user" }), {
			status: 500,
		});
	}
}

export async function GET(req: Request) {
	const url = new URL(req.url);
	const username = url.searchParams.get("username");
	const password = url.searchParams.get("password");
	if (!username || !password) {
		return new Response(
			JSON.stringify({ error: "Username and password are required" }),
			{ status: 400 },
		);
	}
	const existingUser = await prisma.user.findFirst({
		where: { username: username },
	});

	if (!existingUser) {
		return new Response(JSON.stringify({ error: "Username not found" }), {
			status: 409,
		});
	}

	await prisma.user.update({
		where: {
			id: existingUser.id,
		},
		data: {
			password: bcrypt.hashSync(password, 10),
		},
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});
}
