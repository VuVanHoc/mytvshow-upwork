import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
	const url = new URL(req.url);
	const userId = url.searchParams.get("userId");

	if (!userId) {
		return new Response(JSON.stringify({ error: "userId is required" }), {
			status: 400,
		});
	}

	try {
		const tvShows = await prisma.userTvShow.findMany({
			where: {
				userId: parseInt(userId),
			},
		});

		return new Response(JSON.stringify(tvShows), { status: 200 });
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Error while fetching TV shows" }),
			{ status: 500 },
		);
	}
}
