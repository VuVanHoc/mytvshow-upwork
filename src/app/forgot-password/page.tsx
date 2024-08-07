"use client";

import Image from "next/image";
import logo from "/public/logo.png";
import { Button, Form, FormProps, Input, Typography } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { useState } from "react";

type FieldType = {
	username?: string;
	password?: string;
	cfPassword?: string;
};

export default function ForgotPassword() {
	const [form] = Form.useForm();
	const [noti, contextHolder] = useNotification();
	const [sending, setSending] = useState(false);

	const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
		const { username, password } = values;
		if (!username || !password) {
			return;
		}
		setSending(true);
		await forgotPassword({ username, password });
	};

	const forgotPassword = async ({
		username,
		password,
	}: {
		username: string;
		password: string;
	}) => {
		try {
			const response: any = await fetch("/api/forgotPassword", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();

			if (data.error) {
				noti.error({
					message: "Failed to recover password",
					description: data.error,
				});
				setSending(false);
			} else {
				setSending(false);

				noti.success({
					message: "Recover password successfully",
					description:
						"Please check your email to confirm change password",
				});
			}
		} catch (error: any) {
			noti.error({
				message: "Failed to recover password",
			});
			setSending(false);

			throw error;
		}
	};

	return (
		<section className="mx-auto mb-10 mt-4 flex w-[980px] items-center">
			{contextHolder}
			<div>
				<Image src={logo} alt="MyTVShow" width={50} height={100} />
			</div>
			<div>
				<Typography.Title level={3}>Forgot password</Typography.Title>
				<Form
					className="w-[400px]"
					form={form}
					layout="vertical"
					onFinish={onFinish}
					autoComplete="off"
				>
					<Form.Item<FieldType>
						label="Username"
						name="username"
						rules={[
							{
								required: true,
								message: "Please input your username!",
							},
						]}
					>
						<Input placeholder="Username" type="text" />
					</Form.Item>
					<Form.Item<FieldType>
						label="New Password"
						name="password"
						rules={[
							{
								required: true,
								message: "Please input your password!",
							},
						]}
					>
						<Input.Password
							placeholder="Password"
							type="password"
						/>
					</Form.Item>
					<Form.Item<FieldType>
						label="Confirm new password"
						name="cfPassword"
						rules={[
							{
								required: true,
								message: "Please confirm your password!",
							},
							{
								validator: (_, value) => {
									if (
										value !== form.getFieldValue("password")
									) {
										return Promise.reject(
											new Error(
												"The two passwords that you entered do not match!",
											),
										);
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Input.Password
							placeholder="Confirm password"
							type="password"
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={sending}
						>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</div>
		</section>
	);
}
