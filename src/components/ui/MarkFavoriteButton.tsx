import { StarFilled } from "@ant-design/icons";
import { LabelTvShow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Button, notification, Tooltip } from "antd";

interface Props {
	session: any;
	tvshowDetail: { id: number } | null;
	tvshowInMyList: any;
	refretchTvShowInMyList: any;
}

const MarkFavoriteButton: React.FC<Props> = ({
	session,
	tvshowDetail,
	tvshowInMyList,
	refretchTvShowInMyList,
}) => {
	const updateMyList = async (data: {
		userId: number;
		tvShowId: number;
		favorite: boolean;
		label: LabelTvShow;
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
				label: tvshowInMyList.label,
				favorite: !tvshowInMyList.favorite,
			});
		} catch (error) {}
	};

	return (
		<Tooltip
			title={
				tvshowInMyList?.favorite
					? "Remove Favorite"
					: "Mark as Favorite"
			}
			arrow
			placement="bottom"
		>
			<Button
				loading={mutateMarkFavorite.isPending}
				onClick={handleMarkFavorite}
				size="large"
				shape="circle"
				type={tvshowInMyList?.favorite ? "primary" : "default"}
				icon={<StarFilled color="text-yellow-500" />}
			/>
		</Tooltip>
	);
};

export default MarkFavoriteButton;
