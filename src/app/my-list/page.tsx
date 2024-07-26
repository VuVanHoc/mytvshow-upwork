"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/logo.png";

export default function MyListPage() {
	const { data } = useSession();
	if (!data?.user)
		return (
			<section className="mx-auto mb-10 mt-4 flex w-[980px] items-center">
				<div>
					<Image src={logo} alt="MyTVShow" width={100} height={100} />
				</div>
				<div>
					Login or{" "}
					<Link
						className="font-bold text-blue-500 underline"
						href={"/sign-up"}
					>
						Sign up
					</Link>{" "}
					a new account to save your favorite TV shows.
					<br />
					<p>
						Easy to share your list with friends. <br />
						Just one click!
					</p>
					<Link href={"/sign-up"}>
						<button className="mt-8 border border-blue-600 bg-blue-500 px-4 py-2 text-2xl text-white">
							Sign up now
						</button>
					</Link>
				</div>
			</section>
		);
	return <section className="mx-auto mt-4 w-[980px]">My List</section>;
}
