// app/api/signup/route.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
			},
		});

		return new Response(
			JSON.stringify({ message: "User created successfully", user }),
			{ status: 201 },
		);
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: "Error creating user" }), {
			status: 500,
		});
	}
}
