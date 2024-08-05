import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
	try {
		const distinctUserIds = await prisma.userTvShow.findMany({
			distinct: ["userId"],
		});

		const totalDistinctUsers = distinctUserIds.length;

		const totalRecordsByLabel = await prisma.userTvShow.groupBy({
			by: ["label"],
			_count: {
				label: true,
			},
		});

		const res = {
			totalUsers: totalDistinctUsers,
			totalRecordsByLabel: totalRecordsByLabel.reduce(
				(acc: any, labelGroup) => {
					acc[labelGroup.label] = labelGroup._count.label;
					return acc;
				},
				{},
			),
		};

		return new Response(JSON.stringify(res), { status: 200 });
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "Error while fetching TV shows" }),
			{ status: 500 },
		);
	}
}
