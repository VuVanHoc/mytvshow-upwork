import { UnorderedListOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, notification, Tooltip } from "antd";

interface Props {
	session: any;
	tvshowDetail: { id: number } | null;
}

const AddToMyListButton: React.FC<Props> = ({ session, tvshowDetail }) => {
	const addTvShow = async (data: { userId: number; tvShowId: number }) => {
		const response = await fetch("/api/addToMyList", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error("Failed to add to My List");
		}

		return response.json();
	};

	const mutateAddToMyList = useMutation({
		mutationFn: addTvShow,
		onSuccess: () => {
			notification.success({
				message: "Added to My List successfully",
			});
		},
		onError: () => {
			notification.error({
				message: "Failed to add to My List",
			});
		},
	});

	const handleAddToMyList = async () => {
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
			await mutateAddToMyList.mutateAsync({
				tvShowId: tvshowDetail.id,
				userId: session.user.id,
			});
		} catch (error) {}
	};

	return (
		<Tooltip title="Add to My List" arrow placement="bottom">
			<Button
				loading={mutateAddToMyList.isPending}
				onClick={handleAddToMyList}
				size="large"
				shape="circle"
				type="primary"
				icon={<UnorderedListOutlined />}
			/>
		</Tooltip>
	);
};

export default AddToMyListButton;
