// app/api/signup/route.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { username, password, email } = await req.json();

	if (!email) {
		return new Response(JSON.stringify({ error: "Email is required" }), {
			status: 400,
		});
	}
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

		if (existingUser) {
			return new Response(
				JSON.stringify({ error: "Username already taken" }),
				{ status: 409 },
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const user = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
				email,
			},
		});

		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "vanhoc.amazingyou@gmail.com",
				pass: "aewq eesz guji btzx",
			},
		});

		const mailOptions = {
			from: "vanhoc.amazingyou@gmail.com",
			to: "weiew.company@gmail.com",
			subject: `WELCOME TO MYTVSHOW WEBSITE`,
			html: `
				<p>Congratulations ${user.username}! You have successfully registered new account on MyTVShow.</p>
				<ul>
					<li>Username: ${username}</li>
					<li>Email: ${email}</li>
				</ul>
			`,
		};
		try {
			await transporter.sendMail(mailOptions);
			return new Response(
				JSON.stringify({ message: "User created successfully", user }),
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
		return new Response(JSON.stringify({ error: "Error creating user" }), {
			status: 500,
		});
	}
}
