"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "/public/logo.jpg";
import LoginForm from "./LoginForm";
import cx from "clsx";
import { usePathname } from "next/navigation";

const NAVS = [
	{
		href: "/",
		label: "TV SHOWS",
	},
	{
		href: "/users",
		label: "USERS",
	},
	{
		href: "/stats",
		label: "STATS",
	},
	{
		href: "/sign-up",
		label: "SIGN UP",
	},
];
export default function Header() {
	const pathname = usePathname();

	return (
		<header className="h-20 bg-[#222222]">
			<div className="mx-auto flex h-full w-[980px] max-w-[980px] items-center justify-between">
				<div>
					<div className="flex items-center">
						<Link href="/">
							<Image src={logo} alt="MyTVShows" />
						</Link>
						<span className="text-sm text-[#999999]">
							The best way to manage your TV Shows
						</span>
					</div>
					<nav className="mt-2">
						<ul className="flex gap-1">
							{NAVS.map((nav) => (
								<Link
									key={nav.href}
									href={nav.href}
									className={cx(
										"bg-[#454545] px-4 py-1 text-sm font-bold text-white",
										pathname === nav.href
											? "bg-[#7286A9]"
											: "",
										nav.href === "/sign-up" &&
											"bg-[#B04422]",
									)}
								>
									{nav.label}
								</Link>
							))}
						</ul>
					</nav>
				</div>
				<LoginForm />
			</div>
		</header>
	);
}
