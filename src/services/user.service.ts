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
	if (user.password !== password) {
		return Promise.reject("Wrong password");
	}
	return Promise.resolve({
		username: user.username,
		id: user.id,
		name: user.username,
	});
};
