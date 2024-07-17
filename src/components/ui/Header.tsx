import Link from "next/link";

export default function Header() {
	return (
		<header className="mt-4 flex justify-center gap-8">
			<Link href="/">Home</Link>
			<Link href="/admin">Admin</Link>
			<Link href="/user">User</Link>
			<Link href="/global">Global</Link>
		</header>
	);
}
