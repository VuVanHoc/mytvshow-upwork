export const getTvShows = async ({ page = 1, search = "" }) => {
	const response = await fetch(
		`https://api.themoviedb.org/3/discover/tv?page=${page}&with_keywords=${search}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_KEY}`,
			},
		},
	);
	const data = await response.json();
	return data;
};

export const getTvShow = async (id: string) => {
	const response = await fetch(
		`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_ACCESS_KEY}&language=en-US`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_KEY}`,
			},
		},
	);
	const data = await response.json();
	return data;
};
