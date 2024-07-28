"use client";

import { fetchMyListTVShows } from "@/services/user.service";
import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Divider, Skeleton } from "antd";
import Link from "next/link";

export default function UsersPage() {
	const { data: users, isPending } = useQuery({
		queryKey: ["users"],
		queryFn: fetchMyListTVShows,
	});
	if (isPending) {
		return (
			<section className="mx-auto w-[980px]">
				<Skeleton active />
			</section>
		);
	}
	return (
		<section className="mx-auto mt-4 w-[980px]">
			<h1 className="text-2xl">
				All Users //{" "}
				<span className="text-gray-600">{users.length}</span>
			</h1>
			<Divider />
			<div className="grid grid-cols-1 gap-4">
				{users.map((user: any, index: number) => (
					<Link
						href={`/my-list/${user.id}`}
						key={user.username}
						className="flex items-center gap-4"
					>
						{index + 1}.
						<div className="flex gap-2">
							<Avatar
								shape="square"
								size={48}
								icon={<UserOutlined />}
							/>
							<p className="text-xl font-bold text-[#7286A9] hover:underline">
								{user.username}
							</p>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
