import { getRecommendations } from "@/services/tv.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";

export default function Recommendations({ id }: { id: number }) {
	const { data: recommendations, isLoading } = useQuery({
		queryKey: ["recommendations", id],
		queryFn: () => getRecommendations(id),
		enabled: !!id,
	});

	if (isLoading) return <Skeleton active />;
	return (
		<div className="flex w-full gap-4 overflow-auto pb-4">
			{recommendations?.results?.map((item: any) => (
				<Link key={item.id} href={`/show/${item.id}`}>
					<div className="group w-[200px] cursor-pointer">
						<Image
							width={320}
							height={180}
							src={`https://media.themoviedb.org/t/p/w320_and_h180_face${item.poster_path}`}
							alt={item.original_name}
							className="aspect-video w-full rounded-t-lg"
						></Image>
						<div className="w-full items-center justify-center rounded-b-lg bg-slate-100 p-1 text-left group-hover:bg-[#7286A9] group-hover:text-white">
							<p className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold">
								{item.original_name}
							</p>
							<div className="mt-2 flex items-start justify-between text-xs">
								<p>
									Votes: {item.vote_count}
									<br />
									Average: {item.vote_average}
								</p>
								<p>{item.first_air_date}</p>
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
