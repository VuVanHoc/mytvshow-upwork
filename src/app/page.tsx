"use client";

import { getTvShows } from "@/services/tv.service";
import { useQuery } from "@tanstack/react-query";
import { Card, Pagination, Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
	// const characters = "abcdefghijklmnopqrstuvwxyz".split("");
	const [searchQuery, setSearchQuery] = useState("");
	const [getRequest, setRequest] = useState({
		page: 1,
		search: "",
	});
	const { data: shows, isPending } = useQuery({
		queryKey: ["shows", getRequest],
		queryFn: () => getTvShows(getRequest),
	});

	if (isPending) {
		return (
			<div className="mx-auto mt-4 grid w-[980px] grid-cols-4 gap-8">
				{Array(16)
					.fill(0)
					.map((_, index) => (
						<Card key={index}>
							<Skeleton active className="" />
						</Card>
					))}
			</div>
		);
	}
	return (
		<main className="mb-10 pb-20">
			<section className="mx-auto mt-4 w-[980px]">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl">
						All Shows //{" "}
						<span className="text-gray-600">
							{shows.total_results}
						</span>
					</h1>
					<div>
						<input
							className="border px-4"
							type="text"
							name="search"
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button
							className="border border-blue-600 bg-blue-500 px-1 text-white"
							onClick={() =>
								setRequest({
									...getRequest,
									search: searchQuery,
								})
							}
						>
							Search
						</button>
					</div>
				</div>
				{/* <div className="mt-4 flex gap-4 uppercase text-[#7286A9]">
					{characters.map((character) => (
						<p
							key={character}
							className="cursor-pointer hover:font-bold"
						>
							{character}
						</p>
					))}
				</div> */}
				<div className="mt-4 w-full border-b-[1px] border-gray-200"></div>
				<div className="mt-10 grid grid-cols-4 gap-8">
					{shows?.results?.length === 0 && <p>No results found</p>}
					{shows?.results?.map((show: any, index: number) => (
						<Link key={index} href={`/show/${show.id}`}>
							<div className="group w-full cursor-pointer">
								<Image
									width={320}
									height={180}
									src={`https://media.themoviedb.org/t/p/w320_and_h180_face${show.poster_path}`}
									alt={show.original_name}
									className="aspect-video w-full rounded-t-lg"
								></Image>
								<div className="w-full items-center justify-center rounded-b-lg bg-slate-100 p-1 text-left group-hover:bg-[#7286A9] group-hover:text-white">
									<p className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold">
										{show.original_name}
									</p>
									<div className="mt-2 flex items-start justify-between text-xs">
										<p>
											Votes: {show.vote_count}
											<br />
											Average: {show.vote_average}
										</p>
										<p>{show.first_air_date}</p>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
				<div className="mb-8 mt-10 w-full border-b-[1px] border-gray-200"></div>
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
		</main>
	);
}
