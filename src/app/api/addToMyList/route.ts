import { LabelTvShow, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { userId, tvShowId } = await req.json();

	try {
		const existed = await prisma.userTvShow.findFirst({
			where: {
				userId,
				tvShowId,
			},
		});

		const user = await prisma.user.findFirst({
			where: {
				id: userId,
			},
		});
		if (!existed) {
			if (user) {
				await prisma.userTvShow.create({
					data: {
						userId,
						tvShowId,
						favorite: false,
						label: LabelTvShow.HAVE_NOT_WATCHED, // Ensure this label exists
						rate: 0,
						user: {
							connect: user,
						},
					},
				});
				return new Response(
					JSON.stringify({ message: "Added to My List" }),
					{ status: 200 },
				);
			} else {
				return new Response(
					JSON.stringify({ message: "User not found" }),
					{ status: 404 },
				);
			}
		} else {
			return new Response(
				JSON.stringify({ message: "Already in My List" }),
				{ status: 200 },
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to add to My List" }),
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	const url = new URL(req.url);
	const userId = url.searchParams.get("userId");
	const tvShowId = url.searchParams.get("tvShowId");
	try {
		const existed = await prisma.userTvShow.findFirst({
			where: {
				userId: Number(userId),
				tvShowId: Number(tvShowId),
			},
		});
		if (existed) {
			return new Response(
				JSON.stringify({
					id: existed.id,
					label: existed.label,
					rate: existed.rate,
					favorite: existed.favorite,
					userId: existed.userId,
					tvShowId: existed.tvShowId,
				}),
				{ status: 200 },
			);
		}
		return new Response(
			JSON.stringify({ message: "Not found in My List" }),
			{ status: 200 },
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Error while getting from My List" }),
			{ status: 500 },
		);
	}
}
