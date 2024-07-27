import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { userId, tvShowId, favorite, label, rate } = await req.json();

	try {
		const existed = await prisma.userTvShow.findFirst({
			where: {
				userId,
				tvShowId,
			},
		});

		if (!existed) {
			return new Response(
				JSON.stringify({ message: "Not found in My List" }),
				{ status: 200 },
			);
		}
		await prisma.userTvShow.update({
			where: {
				id: existed.id,
			},
			data: {
				favorite,
				label,
				rate,
			},
		});
		return new Response(
			JSON.stringify({ message: "Updated successfully" }),
			{
				status: 200,
			},
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to update My List" }),
			{ status: 500 },
		);
	}
}
