import { LineChartOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { LabelTvShow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import {
	Button,
	Checkbox,
	Modal,
	notification,
	Radio,
	Rate,
	Tooltip,
} from "antd";
import { useState } from "react";

interface Props {
	session: any;
	tvshowDetail: { id: number } | null;
	tvshowInMyList: any;
	refretchTvShowInMyList: any;
}

const RateButton: React.FC<Props> = ({
	session,
	tvshowDetail,
	tvshowInMyList,
	refretchTvShowInMyList,
}) => {
	const [showModalVote, setShowModalVote] = useState(false);
	const [voteForm, setVoteForm] = useState({
		rate: 0,
		label: LabelTvShow.HAVE_NOT_WATCHED,
	});

	const updateMyList = async (data: {
		userId: number;
		tvShowId: number;
		favorite?: boolean;
		label: LabelTvShow;
		rate: number;
	}) => {
		const response = await fetch("/api/updateMyList", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error("Update failed");
		}

		return response.json();
	};

	const mutateMarkFavorite = useMutation({
		mutationFn: updateMyList,
		onSuccess: () => {
			notification.success({
				message: "Updated successfully",
			});
			refretchTvShowInMyList();
			setShowModalVote(false);
		},
		onError: () => {
			notification.error({
				message: "Update failed",
			});
		},
	});

	const handleMarkFavorite = async () => {
		if (!session?.user) {
			notification.error({
				message: "You need to login first",
			});
			return;
		}

		if (!tvshowDetail?.id) {
			notification.error({
				message: "TV Show details are missing",
			});
			return;
		}

		try {
			await mutateMarkFavorite.mutateAsync({
				tvShowId: tvshowDetail.id,
				userId: session.user.id,
				label: voteForm.label,
				rate: voteForm.rate,
			});
		} catch (error) {}
	};

	return (
		<>
			<Tooltip title="Rating this TV show" arrow placement="bottom">
				<Button
					onClick={() => setShowModalVote(true)}
					size="large"
					type="primary"
					icon={<LineChartOutlined />}
				>
					Rate this show
				</Button>
			</Tooltip>
			<Modal
				centered
				width={400}
				title="Rating TV Show"
				open={showModalVote}
				onOk={handleMarkFavorite}
				onCancel={() => setShowModalVote(false)}
			>
				<div className="my-8">
					<div className="flex gap-4">
						<p>Your rating</p>
						<Rate
							allowHalf
							value={voteForm.rate}
							onChange={(rate) =>
								setVoteForm({ ...voteForm, rate })
							}
						/>
						<span>{voteForm.rate * 2} / 10</span>
					</div>
					<div className="mt-4 flex gap-4">
						<p>Add label</p>
						<Radio.Group
							value={voteForm.label}
							onChange={(e) =>
								setVoteForm({
									...voteForm,
									label: e.target.value,
								})
							}
						>
							<Radio value={LabelTvShow.HAVE_NOT_WATCHED}>
								Unseen
							</Radio>
							<Radio value={LabelTvShow.WATCHED}>Seen</Radio>
							<Radio value={LabelTvShow.MUST_WATCH}>
								Must Watch
							</Radio>
						</Radio.Group>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default RateButton;
