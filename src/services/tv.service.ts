import dayjs from "dayjs";

export const getTvShows = async ({
	page = 1,
	search = "",
	year,
	genres,
}: any) => {
	let url = `https://api.themoviedb.org/3/discover/tv?page=${page}&with_keywords=${search}`;
	if (year) url += `&first_air_date_year=${dayjs(year).get("year")}`;
	if (genres) url += `&with_genres=${genres}`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			accept: "application/json",
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_KEY}`,
		},
	});
	const data = await response.json();
	return data;
};

// Get list TOP Rated Shows
export const getTvShowsForStats = async ({ page = 1, year, genres }: any) => {
	let url = `https://api.themoviedb.org/3/tv/top_rated?page=${page}`;
	if (year) url += `&first_air_date_year=${dayjs(year).get("year")}`;
	if (genres) url += `&with_genres=${genres}`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			accept: "application/json",
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_KEY}`,
		},
	});
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

export const getTvShowInMyList = async ({
	userId,
	tvShowId,
}: {
	userId: number;
	tvShowId: number;
}) => {
	const response = await fetch(
		`/api/addToMyList?userId=${userId}&tvShowId=${tvShowId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
		},
	);
	const data = await response.json();
	return data;
};

export const fetchMyListTVShows = async (userId: number) => {
	try {
		const response = await fetch(`/api/getMyListTVShow?userId=${userId}`, {
			method: "GET",
		});

		if (!response.ok) {
			throw new Error("Failed to fetch TV shows");
		}

		const data = await response.json();
		return data;
	} catch (error) {}
};

export const getTrailerVideo = async (videoName: string) => {
	// TODO: Update key param with your Google API key
	const GOOGLE_API_KEY = "AIzaSyCHloYzysU1-KNAYh-wGdfc2fnuS_iKYko";
	const response = await fetch(
		`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${videoName}&type=video&key=${GOOGLE_API_KEY}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
		},
	);
	const data = await response.json();
	return data;
};

export const getRecommendations = async (id: number) => {
	const response = await fetch(
		`https://api.themoviedb.org/3/tv/${id}/recommendations?page=1&api_key=${process.env.NEXT_PUBLIC_TMDB_ACCESS_KEY}&language=en-US`,
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

export const getListTVGenres = async () => {
	const response = await fetch(
		`https://api.themoviedb.org/3/genre/tv/list?language=en`,
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
