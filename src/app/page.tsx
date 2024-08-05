"use client";

import {
	getListKeywordsByQuery,
	getListTVGenres,
	getTvShows,
} from "@/services/tv.service";
import { ClearOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
	AutoComplete,
	Button,
	Card,
	DatePicker,
	Input,
	Pagination,
	Skeleton,
} from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
	// const characters = "abcdefghijklmnopqrstuvwxyz".split("");
	const [searchQuery, setSearchQuery] = useState("");
	const [getRequest, setRequest] = useState<any>({
		page: 1,
		search: "",
		year: null,
		genres: null,
	});
	const { data: shows, isPending } = useQuery({
		queryKey: ["shows", getRequest],
		queryFn: () => getTvShows(getRequest),
	});

	const { data: listGenres } = useQuery({
		queryKey: ["listGenres"],
		queryFn: () => getListTVGenres(),
	});

	// Use react-query's useQuery with the debounced function
	const { data: keywords } = useQuery({
		queryKey: ["keywords", searchQuery],
		queryFn: () => getListKeywordsByQuery(searchQuery),
		enabled: !!searchQuery, // Ensure query runs only when searchQuery is truthy
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
				<h1 className="text-2xl">
					Discover All TV Shows //{" "}
					<span className="text-gray-600">{shows.total_results}</span>
				</h1>
				<div className="rounded border p-4">
					<div className="flex items-center justify-between text-xl">
						Filters{" "}
						<Button
							danger
							icon={<ClearOutlined />}
							onClick={() => {
								setRequest({
									page: 1,
									search: "",
									year: null,
									genres: null,
								});
								setSearchQuery("");
							}}
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
						<div>
							<p>Keywords</p>
							<AutoComplete
								options={[
									...(keywords?.results?.map((k: any) => ({
										label: k.name,
										value: k.name,
									})) || []),
								]}
								popupMatchSelectWidth={252}
								style={{ width: 300 }}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e)}
							>
								<Input.Search
									placeholder="Enter keywords..."
									enterButton
									onSearch={() =>
										setRequest({
											...getRequest,
											search:
												keywords?.results?.find(
													(e: any) =>
														e.name === searchQuery,
												)?.id || searchQuery,
										})
									}
								/>

								{/* <input
									className="border px-4"
									type="text"
									name="search"
									placeholder="Search..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
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
								</button> */}
							</AutoComplete>
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
