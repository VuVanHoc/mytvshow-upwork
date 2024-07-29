"use client";

import AddToMyListButton from "@/components/ui/AddToMyListButton";
import MarkFavoriteButton from "@/components/ui/MarkFavoriteButton";
import RateButton from "@/components/ui/RateButton";
import TvShowLabel from "@/components/ui/TvShowLabel";
import WatchTrailerButton from "@/components/ui/WatchTrailerButton";
import { getTvShow, getTvShowInMyList } from "@/services/tv.service";
import { LinkOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
	Button,
	Divider,
	Empty,
	Progress,
	Skeleton,
	Tag,
	Typography,
} from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function DetailShowPage({ params }: { params: { id: string } }) {
	const { id } = params;

	const { data: session } = useSession();

	const { data: tvshowInMyList, refetch: refretchTvShowInMyList } = useQuery({
		queryKey: ["tvshowInMyList", session?.user],
		queryFn: () =>
			getTvShowInMyList({
				userId: (session as any)?.id,
				tvShowId: Number(id),
			}),
		enabled: !!session?.user,
	});
	const { data: tvshowDetail, isPending } = useQuery({
		queryKey: ["tvshowDetail", id],
		queryFn: () => getTvShow(id),
		enabled: !!id,
	});

	const userScoreStrokeColor = (userScore: number) => {
		if (userScore >= 80) {
			return "green";
		} else if (userScore >= 50) {
			return "orange";
		} else {
			return "red";
		}
	};

	if (isPending) {
		return (
			<section className="mx-auto mt-4 w-[980px]">
				<Skeleton active className="" />
			</section>
		);
	}
	if (!tvshowDetail) return <Empty />;
	return (
		<section className="relative mx-auto mb-10 mt-4 w-[980px]">
			<TvShowLabel label={tvshowInMyList?.label} />
			<div className="flex gap-8">
				<Image
					src={`https://media.themoviedb.org/t/p/w300_and_h450_face${tvshowDetail.poster_path}`}
					alt={tvshowDetail.name}
					width={300}
					height={450}
					className="h-full rounded-lg"
				/>
				<div>
					<h1 className="text-4xl font-bold">{tvshowDetail.name}</h1>
					<p> {dayjs(tvshowDetail.first_air_date).format("YYYY")}</p>
					<div className="mt-4 flex w-full justify-between gap-4 text-sm">
						<div>
							<p>Genres</p>
							{tvshowDetail.genres.map((genre: any) => (
								<Tag color="blue" key={genre.id}>
									{genre.name}
								</Tag>
							))}
						</div>
						<div>
							<p>Type</p>
							<Tag color="orange-inverse">
								{tvshowDetail.type}
							</Tag>
						</div>
					</div>

					<div className="mt-4 flex gap-8">
						<p className="text-center">
							<Progress
								strokeColor={userScoreStrokeColor(
									tvshowDetail.vote_average * 10,
								)}
								size={"small"}
								type="circle"
								percent={
									Number(
										tvshowDetail.vote_average * 10,
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
								format={() => tvshowDetail.vote_count}
							/>
							<br />
							Vote count
						</p>
						{session?.user && (
							<>
								<p className="text-center">
									<Progress
										strokeColor={userScoreStrokeColor(
											(tvshowInMyList?.rate ?? 0) *
												10 *
												2,
										)}
										size={"small"}
										type="circle"
										percent={
											Number(
												(tvshowInMyList?.rate ?? 0) *
													10 *
													2,
											).toFixed(2) as any
										}
									/>
									<br />
									Your Rating
								</p>
							</>
						)}
					</div>
					<div className="mt-4 flex gap-4">
						<AddToMyListButton
							session={session}
							tvshowDetail={tvshowDetail}
						/>
						<MarkFavoriteButton
							refretchTvShowInMyList={refretchTvShowInMyList}
							tvshowInMyList={tvshowInMyList}
							session={session}
							tvshowDetail={tvshowDetail}
						/>

						{session?.user && (
							<RateButton
								refretchTvShowInMyList={refretchTvShowInMyList}
								tvshowInMyList={tvshowInMyList}
								session={session}
								tvshowDetail={tvshowDetail}
							/>
						)}
						<WatchTrailerButton
							tvshowName={`${tvshowDetail.name} Trailer`}
						/>
						<Link href={tvshowDetail.homepage} target="_blank">
							<Button
								size="large"
								type="default"
								icon={<LinkOutlined />}
							>
								Visit Website
							</Button>
						</Link>
					</div>
					<div className="mt-8">
						<p className="italic opacity-70">
							{tvshowDetail.tagline}
						</p>
						<p className="text-lg font-bold">Overview</p>
						<p>{tvshowDetail.overview}</p>
					</div>
					<div className="mt-4 grid grid-cols-3">
						{tvshowDetail.created_by.map((item: any) => (
							<p key={item.id}>
								{item.name}
								<br />
								<span className="text-sm">Creator</span>
							</p>
						))}
					</div>
				</div>
			</div>
			<Divider />
			<div>
				<Typography.Title level={3}>Upcoming Episodes</Typography.Title>
				{tvshowDetail.next_episode_to_air ? (
					<>
						{" "}
						<div className="grid grid-cols-2 gap-4">
							<div
								key={tvshowDetail.next_episode_to_air.id}
								className="flex w-full gap-4 rounded-lg border shadow-sm"
							>
								<Image
									src={`https://media.themoviedb.org/t/p/w130_and_h195_face${tvshowDetail.next_episode_to_air?.still_path || tvshowDetail.poster_path}`}
									alt={tvshowDetail.next_episode_to_air.name}
									width={130}
									height={195}
									className="h-full rounded-lg"
								/>
								<div className="pr-2">
									<p className="text-lg font-bold">
										{tvshowDetail.next_episode_to_air.name}
									</p>
									<p>
										{dayjs(
											tvshowDetail.next_episode_to_air
												.air_date,
										).format("YYYY-MM-DD")}{" "}
										-{" "}
										<span className="font-bold">
											{
												tvshowDetail.next_episode_to_air
													.episode_number
											}
										</span>{" "}
										Episode(s)
									</p>
									<p>
										Episode type:{" "}
										{
											tvshowDetail.next_episode_to_air
												.episode_type
										}
									</p>
									<Typography.Paragraph
										className="mt-8"
										ellipsis={{ rows: 3 }}
									>
										{
											tvshowDetail.next_episode_to_air
												.overview
										}
									</Typography.Paragraph>
								</div>
							</div>
						</div>
					</>
				) : (
					<p>There are no Upcoming Episodes for this Show.</p>
				)}
			</div>
			<Divider />
			<div>
				<Typography.Title level={3}>Seasons</Typography.Title>
				<div className="grid grid-cols-2 gap-4">
					{tvshowDetail.seasons.map((item: any) => (
						<div
							key={item.id}
							className="flex w-full gap-4 rounded-lg border shadow-sm"
						>
							<Image
								src={`https://media.themoviedb.org/t/p/w130_and_h195_face${item.poster_path}`}
								alt={item.name}
								width={130}
								height={195}
								className="h-full rounded-lg"
							/>
							<div className="pr-2">
								<p className="text-lg font-bold">{item.name}</p>
								<p>
									{dayjs(item.air_date).format("YYYY")} -{" "}
									<span className="font-bold">
										{item.episode_count}
									</span>{" "}
									Episodes{" "}
								</p>

								{!!item.vote_average && (
									<span className="text-sm text-gray-500">
										Score:{" "}
										<Tag color="geekblue">
											{item.vote_average}
										</Tag>
									</span>
								)}

								<Typography.Paragraph
									className="mt-8"
									ellipsis={{ rows: 3 }}
								>
									{item.overview}
								</Typography.Paragraph>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
