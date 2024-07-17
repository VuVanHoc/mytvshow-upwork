import { ErrorsEnum } from "@/enums/errors";
import { COOKIES } from "@/utils/constants";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: any) => void;
}> = [];

export const getIsRefreshing = () => isRefreshing;
export const setIsRefreshing = (val: boolean) => {
	isRefreshing = val;
};

const accessToken = getCookie(COOKIES.ACCESSTOKEN);

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};
const refreshToken = async () => {
	try {
		const refreshToken = getCookie(COOKIES.REFRESHTOKEN);
		const response = await fetch(
			`${
				process.env.NEXT_PUBLIC_BASE_URL
			}/auth/token/refresh?refreshToken=${refreshToken}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error("Failed to refresh token");
		}

		const data = await response.json();
		const newAccessToken = data.accessToken;
		setCookie(COOKIES.ACCESSTOKEN, newAccessToken);
		return newAccessToken;
	} catch (error) {
		console.error("Error refreshing token:", error);
		throw error;
	}
};

const AXIOS = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 60000,
});

AXIOS.interceptors.request.use((config) => {
	if (config.headers) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

AXIOS.interceptors.response.use(
	(response) => {
		if (response.status === 200 || response.status === 201) {
			return response.data;
		}
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response.status === 401 &&
			error.response.data.message === ErrorsEnum.TOKEN_EXPRIED
		) {
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					const newAccessToken = await refreshToken();
					isRefreshing = false;
					processQueue(null, newAccessToken);
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return AXIOS(originalRequest);
				} catch (refreshError) {
					processQueue(refreshError, null);
					deleteCookie(COOKIES.REFRESHTOKEN);
					// Redirect to login page if needed
					// window.open(RoutesEnum.LOGIN, "_self");
					return Promise.reject(refreshError);
				}
			}

			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			})
				.then((token) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return AXIOS(originalRequest);
				})
				.catch((err) => {
					return Promise.reject(err);
				});
		}

		return Promise.reject(error);
	},
);

export default AXIOS;
