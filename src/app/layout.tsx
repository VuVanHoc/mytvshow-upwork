import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import AppProvider from "@/providers/AppProvider";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MyTVShows",
	description:
		"TV Shows management application. Keeps track of every show you have and what episodes you have seen (or not) and also if you have subtitles for each episode.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AppProvider>
					<Header />
					{children}
					<footer className="fixed bottom-0 left-0 w-full bg-[#222222] text-white">
						<div className="mx-auto flex h-10 w-[980px] max-w-[980px] items-center gap-4 text-xs">
							<Link href={"/about"}>About</Link>
							<Link href={"/blog"}>Blog</Link>
							<Link href={"/twitter"}>Twitter</Link>
							<Link href={"/contact"}>Contact</Link>
						</div>
					</footer>
				</AppProvider>
			</body>
		</html>
	);
}
