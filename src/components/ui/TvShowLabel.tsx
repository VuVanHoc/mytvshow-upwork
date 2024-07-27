import { LabelTvShow } from "@prisma/client";
import { Tag, Tooltip } from "antd";
import Image from "next/image";

export default function TvShowLabel({ label }: { label?: LabelTvShow }) {
	if (label === LabelTvShow.HAVE_NOT_WATCHED)
		return (
			<div className="absolute right-0 top-0">
				<Tooltip
					title="You have not seen this TV show."
					placement="bottom"
				>
					<Tag color="gray">UNSEEN</Tag>
				</Tooltip>
			</div>
		);
	if (label === LabelTvShow.WATCHED)
		return (
			<div className="absolute right-0 top-0">
				<Tooltip title="You have seen this TV show." placement="bottom">
					<Tag
						className="absolute right-0 top-0"
						color="green-inverse"
					>
						SEEN
					</Tag>
				</Tooltip>
			</div>
		);
	if (label === LabelTvShow.MUST_WATCH)
		return (
			<div className="text-md absolute right-0 top-0 flex font-bold uppercase text-yellow-300">
				<Image src="/medal.png" width={30} height={16} alt="star" />
				<span>Must watch</span>
			</div>
		);
	return null;
}
