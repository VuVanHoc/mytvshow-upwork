export default function Home() {
	const shows = Array(20).fill(0);
	const characters = "abcdefghijklmnopqrstuvwxyz".split("");
	return (
		<main className="mb-10">
			<div className="h-10 w-full bg-[#7286A9]"></div>
			<section className="mx-auto mt-4 w-[980px]">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl">All Shows // {shows.length}</h1>
					<div>
						<input
							className="border px-4"
							type="text"
							name="search"
							placeholder="Search..."
						/>
						<button className="border border-blue-600 bg-blue-500 px-1 text-white">
							Search
						</button>
					</div>
				</div>
				<div className="mt-4 flex gap-4 uppercase text-[#7286A9]">
					{characters.map((character) => (
						<p
							key={character}
							className="cursor-pointer hover:font-bold"
						>
							{character}
						</p>
					))}
				</div>
				<div className="mt-4 w-full border-b-[1px] border-gray-200"></div>
				<div className="mt-10 grid grid-cols-5 gap-8">
					{shows.map((show) => (
						<div key={show} className="group w-full cursor-pointer">
							<div className="flex w-full items-center justify-center text-center group-hover:bg-[#7286A9] group-hover:text-white">
								Title
							</div>
							<div className="aspect-video w-full border-[0.5px] border-gray-200"></div>
						</div>
					))}
				</div>
				<div className="mt-10 w-full border-b-[1px] border-gray-200"></div>
				<div className="mx-auto mt-4 flex items-center justify-center gap-10">
					<p>Page 1 of 141</p>
					<button className="text-[#7286A9] underline">Next</button>
					<button className="text-[#7286A9] underline">Last</button>
				</div>
			</section>
		</main>
	);
}
