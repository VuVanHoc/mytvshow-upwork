"use client";

import { getTvShowsForStats } from "@/services/tv.service";
import { useQuery } from "@tanstack/react-query";
import { Divider, Pagination, Progress, Skeleton, Typography } from "antd";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { userScoreStrokeColor } from "@/utils";

export default function StatsPage() {
	const [getRequest, setRequest] = useState({
		page: 1,
	});
	const { data: shows, isPending } = useQuery({
		queryKey: ["shows", getRequest],
		queryFn: () => getTvShowsForStats(getRequest),
	});

	if (isPending) {
		return (
			<div className="mx-auto mt-4 grid w-[980px] grid-cols-4 gap-8">
				<Skeleton active />
			</div>
		);
	}
	return (
		<section className="mx-auto mb-10 mt-4 w-[980px]">
			<h1 className="text-2xl">
				Top Rated TV Shows //<span>{shows.total_results}</span>
			</h1>
			<Divider />
			<div className="grid grid-cols-1 gap-4">
				{shows.results.map((show: any) => (
					<div
						key={show.id}
						className="relative flex w-full gap-4 rounded-lg border shadow-sm"
					>
						<Image
							src={`https://media.themoviedb.org/t/p/w130_and_h195_face${show.poster_path}`}
							alt={show.name}
							width={130}
							height={195}
							className="h-full rounded-lg"
						/>
						<div className="flex-1 pr-2">
							<div className="flex w-full justify-between">
								<Link href={`/show/${show.id}`}>
									<p className="text-xl font-bold hover:text-blue-600">
										{show.name}{" "}
										<span className="font-normal text-gray-400">
											(
											{dayjs(show.air_date).format(
												"YYYY",
											)}
											)
										</span>
									</p>
								</Link>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Origin name: {show.original_name}
								</p>
								<p></p>
							</div>
							<div className="mt-2 flex w-full gap-8">
								<p className="text-center">
									<Progress
										strokeColor={userScoreStrokeColor(
											show.vote_average * 10,
										)}
										size={"small"}
										type="circle"
										percent={
											Number(
												show.vote_average * 10,
											).toFixed(2) as any
										}
									/>
									<br />
									Average Score
								</p>
								<p className="text-center">
									<Progress
										// strokeColor={""}
										size={"small"}
										type="circle"
										percent={100}
										format={() => show.vote_count}
									/>
									<br />
									Vote count
								</p>
							</div>
							<Typography.Paragraph
								className="mt-4"
								ellipsis={{ rows: 3 }}
							>
								{show.overview}
							</Typography.Paragraph>
						</div>
					</div>
				))}
			</div>
			<br />
			<Pagination
				align="center"
				showSizeChanger={false}
				total={shows.total_results}
				defaultCurrent={1}
				pageSize={20}
				current={getRequest.page}
				onChange={(page) => setRequest({ ...getRequest, page })}
				showTotal={(total, range) =>
					`${range[0]}-${range[1]} of ${total} items`
				}
			/>
		</section>
	);
}
