"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyListTVShows } from "@/services/tv.service";
import MyListTvShowItem from "@/components/ui/MyListTvShowItem";
import { Divider, Skeleton, Typography } from "antd";
import { LabelTvShow } from "@prisma/client";

export default function ListTvShowOfUserById({
	params,
}: {
	params: { userid: string };
}) {
	const { userid } = params;

	const { data: shows, isPending } = useQuery({
		queryKey: ["shows"],
		queryFn: () => fetchMyListTVShows(+userid),
		enabled: !!userid,
	});
	if (isPending) {
		return (
			<section className="mx-auto mb-10 mt-4 w-[980px]">
				<Skeleton active />
				<br />
				<br />
				<Skeleton active />
				<br />
				<br />
				<Skeleton active />
			</section>
		);
	}
	return (
		<section className="mx-auto mb-10 mt-4 w-[980px]">
			<h1 className="text-2xl">
				List TV Shows //{" "}
				<span className="text-gray-600">
					{shows?.length ?? 0} item(s)
				</span>
			</h1>

			<Divider />

			{/* List TV Show Must Watch */}
			<Typography.Title level={3} className="!text-yellow-400">
				Must Watch
			</Typography.Title>
			<div className="grid grid-cols-1 gap-4">
				{shows
					?.filter((e: any) => e.label === LabelTvShow.MUST_WATCH)
					?.map((show: any) => (
						<MyListTvShowItem
							key={show.id}
							tvShowId={show.tvShowId}
							favorite={show.favorite}
							label={show.label}
							rate={show.rate}
						/>
					))}
			</div>

			{/* List TV Show Have seen */}
			<br />
			<Typography.Title level={3} className="!text-green-400">
				Have seen
			</Typography.Title>
			<div className="grid grid-cols-1 gap-4">
				{shows
					?.filter((e: any) => e.label === LabelTvShow.WATCHED)
					?.map((show: any) => (
						<MyListTvShowItem
							key={show.id}
							tvShowId={show.tvShowId}
							favorite={show.favorite}
							label={show.label}
							rate={show.rate}
						/>
					))}
			</div>

			{/* List TV Show Have not seen */}
			<br />
			<Typography.Title level={3} className="!text-gray-800">
				Have not seen
			</Typography.Title>
			<div className="grid grid-cols-1 gap-4">
				{shows
					?.filter(
						(e: any) => e.label === LabelTvShow.HAVE_NOT_WATCHED,
					)
					?.map((show: any) => (
						<MyListTvShowItem
							key={show.id}
							tvShowId={show.tvShowId}
							favorite={show.favorite}
							label={show.label}
							rate={show.rate}
						/>
					))}
			</div>
		</section>
	);
}
