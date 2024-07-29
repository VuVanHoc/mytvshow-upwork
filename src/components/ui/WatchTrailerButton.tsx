import { getTrailerVideo } from "@/services/tv.service";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import { useState } from "react";

export default function WatchTrailerButton({
	tvshowName,
}: {
	tvshowName: string;
}) {
	const [showTrailer, setShowTrailer] = useState(false);

	const { data: trailer } = useQuery({
		queryKey: ["trailer", tvshowName],
		queryFn: () => getTrailerVideo(tvshowName),
		enabled: !!tvshowName,
	});
	return (
		<>
			<Button
				icon={<PlayCircleOutlined />}
				type="primary"
				size="large"
				onClick={() => setShowTrailer(true)}
			>
				Watch Trailer
			</Button>
			<Modal
				title={tvshowName}
				width={1400}
				open={showTrailer}
				footer={null}
				onCancel={() => setShowTrailer(false)}
			>
				<div className="flex justify-center">
					<iframe
						width={1337}
						height={751}
						allowFullScreen
						title={trailer?.items[0]?.snippet?.title}
						src={`https://www.youtube.com/embed/${trailer?.items[0]?.id?.videoId}`}
					/>
				</div>
			</Modal>
		</>
	);
}
