import Link from "next/link";

export default function LoginForm() {
	return (
		<form className="text-xs">
			<div className="flex gap-1">
				<input placeholder="Username" type="text" name="username" />
				<input placeholder="Password" type="password" name="password" />
				<button className="border border-blue-600 bg-blue-500 px-1 text-sm text-white">
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
		</form>
	);
}
