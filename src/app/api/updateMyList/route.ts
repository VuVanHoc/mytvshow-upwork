import { LabelTvShow, PrismaClient } from "@prisma/client";

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
						favorite: favorite,
						label: label || LabelTvShow.HAVE_NOT_WATCHED, // Ensure this label exists
						rate: rate ?? 0,
						user: {
							connect: user,
						},
					},
				});
				return new Response(
					JSON.stringify({ message: "Updated successfully" }),
					{
						status: 200,
					},
				);
			}
		} else {
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
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Failed to update My List" }),
			{ status: 500 },
		);
	}
}
