import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { ILoginResponse } from "@/types/user";

export const signInService = async ({
	username,
	password,
}: {
	username: string;
	password: string;
}): Promise<ILoginResponse> => {
	const user = await prisma.user.findFirst({
		where: {
			username,
		},
	});
	if (!user) {
		return Promise.reject("User not found");
	}
	if (!bcrypt.compareSync(password, user.password)) {
		return Promise.reject("Wrong password");
	}
	return Promise.resolve({
		username: user.username,
		id: user.id,
		name: user.username,
	});
};

export const fetchMyListTVShows = async () => {
	try {
		const response = await fetch(`/api/users`, {
			method: "GET",
		});

		if (!response.ok) {
			throw new Error("Failed to fetch users");
		}

		const data = await response.json();
		return data;
	} catch (error) {}
};
