"use client";

import { getTvShows } from "@/services/tv.service";
import { useQuery } from "@tanstack/react-query";

export default function TvShowList() {
	const { data: shows, isPending } = useQuery({
		queryKey: ["shows"],
		queryFn: getTvShows,
	});
	return (
		<div className="mt-10 grid grid-cols-5 gap-8">
			{shows.map((show: any) => (
				<div key={show} className="group w-full cursor-pointer">
					<div className="flex w-full items-center justify-center text-center group-hover:bg-[#7286A9] group-hover:text-white">
						Title
					</div>
					<div className="aspect-video w-full border-[0.5px] border-gray-200"></div>
				</div>
			))}
		</div>
	);
}
