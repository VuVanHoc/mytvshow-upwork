import { Spin } from "antd";

export default function Loading() {
	return (
		<section className="flex h-[500px] w-full items-center justify-center">
			<Spin size="large" />
		</section>
	);
}
