import useNotification from "antd/es/notification/useNotification";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
	const [form, setForm] = useState({
		username: "",
		password: "",
	});
	const [notification, contextHolder] = useNotification();
	const { data } = useSession();

	const handleSignIn = async () => {
		if (
			!form.username ||
			!form.password ||
			form.username === "" ||
			form.password === ""
		) {
			notification.error({
				message: "Please enter username and password",
			});
			return;
		}
		const res = await signIn("credentials", {
			redirect: false,
			username: form.username,
			password: form.password,
		});
		if (res?.error) {
			notification.error({
				message: "Error",
				description: res.error,
			});
		}
	};
	if (data) {
		return (
			<div>
				<p className="text-white">Hello, {data.user?.name}</p>
				<button
					className="border border-blue-600 bg-blue-500 px-1 text-sm text-white"
					onClick={() => signOut()}
				>
					Log out
				</button>
			</div>
		);
	}
	return (
		<>
			{contextHolder}
			<div className="text-xs">
				<div className="flex gap-1">
					<input
						placeholder="Username"
						value={form.username}
						onChange={(e) =>
							setForm({ ...form, username: e.target.value })
						}
						type="text"
						name="username"
					/>
					<input
						value={form.password}
						onChange={(e) =>
							setForm({ ...form, password: e.target.value })
						}
						placeholder="Password"
						type="password"
						name="password"
					/>
					<button
						onClick={handleSignIn}
						className="border border-blue-600 bg-blue-500 px-1 text-sm text-white"
					>
						Login
					</button>
				</div>
				<div className="mt-2 text-white">
					<input
						type="checkbox"
						id="remember"
						name="remember"
						aria-label="remember"
					/>
					<label htmlFor="remember" className="cursor-pointer">
						Remember me
					</label>
					<span>{` | `}</span>
					<Link href="/forgot-password" className="underline">
						Forgot your password?
					</Link>
					<span>{` | `}</span>
					<Link href="/sign-up" className="underline">
						Sign up
					</Link>
				</div>
			</div>
		</>
	);
}
