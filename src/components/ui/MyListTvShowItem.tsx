import { getTvShow } from "@/services/tv.service";
import { LabelTvShow } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Rate, Skeleton, Tag, Typography } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import TvShowLabel from "./TvShowLabel";
import Link from "next/link";

export default function MyListTvShowtvshowDetail({
	tvShowId,
	favorite,
	label,
	rate,
}: {
	tvShowId: number;
	favorite: boolean;
	label?: LabelTvShow;
	rate?: number;
}) {
	const { data: tvshowDetail, isPending } = useQuery({
		queryKey: ["tvshowDetail", tvShowId],
		queryFn: () => getTvShow(tvShowId.toString()),
		enabled: !!tvShowId,
	});
	if (isPending) {
		return <Skeleton active />;
	}

	if (!tvshowDetail) {
		return null;
	}
	return (
		<div className="relative flex w-full gap-4 rounded-lg border shadow-sm">
			<Image
				src={`https://media.themoviedb.org/t/p/w130_and_h195_face${tvshowDetail.poster_path}`}
				alt={tvshowDetail.name}
				width={130}
				height={195}
				className="h-full rounded-lg"
			/>
			<div className="flex-1 pr-2">
				<div className="flex w-full justify-between">
					<Link href={`/show/${tvshowDetail.id}`}>
						<p className="text-xl font-bold">{tvshowDetail.name}</p>
					</Link>
					<div className="relative min-w-[150px]">
						<TvShowLabel label={label} />
					</div>
				</div>

				<p>
					{dayjs(tvshowDetail.air_date).format("YYYY")} -{" "}
					<span className="font-bold">
						{tvshowDetail.episode_count}
					</span>{" "}
					Episodes{" "}
				</p>

				{!!tvshowDetail.vote_average && (
					<span className="text-sm text-gray-500">
						Average Score:{" "}
						<Tag color="geekblue">{tvshowDetail.vote_average}</Tag>
					</span>
				)}
				<p className="mt-2 text-sm font-bold text-yellow-400">
					{favorite && "Your Favorite"}
				</p>
				<Rate allowHalf value={Number(rate)} disabled />
				<span>
					{` `}
					{(rate ?? 0) * 2} / 10
				</span>
				<Typography.Paragraph className="mt-4" ellipsis={{ rows: 3 }}>
					{tvshowDetail.overview}
				</Typography.Paragraph>
			</div>
		</div>
	);
}
