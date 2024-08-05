"use client";

import {
	getListTVGenres,
	getListTvShowOnAirToday,
	getStatistics,
	getTvShowsForStats,
} from "@/services/tv.service";
import { useQuery } from "@tanstack/react-query";
import {
	Button,
	DatePicker,
	Divider,
	Pagination,
	Progress,
	Skeleton,
	Typography,
} from "antd";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { userScoreStrokeColor } from "@/utils";
import { ClearOutlined } from "@ant-design/icons";

export default function StatsPage() {
	const [getRequest, setRequest] = useState<any>({
		page: 1,
		year: null,
		genres: null,
	});
	const { data: shows, isPending } = useQuery({
		queryKey: ["shows", getRequest],
		queryFn: () => getTvShowsForStats(getRequest),
	});

	const { data: listGenres } = useQuery({
		queryKey: ["listGenres"],
		queryFn: () => getListTVGenres(),
	});

	const { data: statistics } = useQuery({
		queryKey: ["statistics"],
		queryFn: () => getStatistics(),
	});

	const { data: listTVShowOnAirToday } = useQuery({
		queryKey: ["listTVShowOnAirToday"],
		queryFn: getListTvShowOnAirToday,
	});

	const { data: showsIn2024 } = useQuery({
		queryKey: ["showsIn2024", getRequest],
		queryFn: () =>
			getTvShowsForStats({
				page: 1,
				year: "2024-01-01",
				genres: null,
			}),
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
			<h1 className="text-2xl">Discover TV Shows By Top Rated</h1>

			<div className="rounded border p-4">
				<div className="flex justify-between">
					<div className="flex-1">
						<p className="text-xl">TV Shows Stats</p>
						<ul className="ml-8 list-disc">
							<li>
								Total:{" "}
								<span className="font-bold text-blue-500">
									{shows.total_results}
								</span>{" "}
								TV shows
							</li>
							<li>
								{listTVShowOnAirToday?.total_results} New TV
								Shows were added today
							</li>
							<li>
								{showsIn2024?.total_results} TV shows were added
								in 2024
							</li>
						</ul>
					</div>
					<div className="flex-1">
						<p className="text-xl">MyTVShows Stats</p>

						<ul className="ml-8 list-disc">
							<li>
								Total:{" "}
								<span className="font-bold text-blue-500">
									{statistics?.totalUsers}
								</span>{" "}
								active users.
							</li>
							<li>
								{statistics?.totalRecordsByLabel?.MUST_WATCH}{" "}
								{`shows added to "Must watch"`}
							</li>
							<li>
								{statistics?.totalRecordsByLabel?.WATCHED} TV
								{`shows added to "Watched"`}
							</li>
							<li>
								{
									statistics?.totalRecordsByLabel
										?.HAVE_NOT_WATCHED
								}{" "}
								{`shows added to "Haven't watched"`}
							</li>
						</ul>
					</div>
				</div>
				<Divider />
				<div className="flex items-center justify-between text-xl">
					Filters{" "}
					<Button
						danger
						icon={<ClearOutlined />}
						onClick={() =>
							setRequest({
								page: 1,
								year: null,
								genres: null,
							})
						}
					>
						Clear filter
					</Button>
				</div>
				<div className="flex flex-col gap-2">
					<div>
						<p>First Air Date</p>
						<DatePicker
							picker="year"
							format="YYYY"
							value={
								dayjs(getRequest.year).isValid()
									? dayjs(getRequest.year)
									: null
							}
							onChange={(e) =>
								setRequest({
									...getRequest,
									year: e,
								})
							}
						/>
					</div>
				</div>
				<div className="">
					<p>Genres</p>
					<div className="flex flex-wrap gap-2">
						{listGenres?.genres?.map((genre: any) => (
							<Button
								shape="round"
								value={genre.id}
								key={genre.id}
								type={
									getRequest.genres === genre.id
										? "primary"
										: "default"
								}
								onClick={() =>
									setRequest({
										...getRequest,
										genres: genre.id,
									})
								}
							>
								{genre.name}
							</Button>
						))}
					</div>
				</div>
			</div>
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
										format={(percent) => `${percent}%`}
										strokeColor={userScoreStrokeColor(
											show.vote_average * 10,
										)}
										size={"small"}
										type="circle"
										percent={
											Number(
												show.vote_average * 10,
											).toFixed(0) as any
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
