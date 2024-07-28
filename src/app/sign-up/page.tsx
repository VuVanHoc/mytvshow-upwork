"use client";

import { Button, Form, Input, Typography } from "antd";
import type { FormProps } from "antd";
import Image from "next/image";
import logo from "/public/logo.png";
import useNotification from "antd/es/notification/useNotification";
import { useState } from "react";

type FieldType = {
	username?: string;
	password?: string;
	cfPassword?: string;
};

export default function SignUpPage() {
	const [form] = Form.useForm();
	const [noti, contextHolder] = useNotification();
	const [sending, setSending] = useState(false);

	const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
		const { username, password } = values;
		if (!username || !password) {
			return;
		}
		setSending(true);
		await signup(username, password);
	};
	const signup = async (username: string, password: string) => {
		try {
			const response: any = await fetch("/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();

			if (data.error) {
				noti.error({
					message: "Failed to signup",
					description: data.error,
				});
				setSending(false);
			} else {
				setSending(false);

				noti.success({
					message: "Signup successfully",
				});
				window.location.href = "/";
			}
		} catch (error: any) {
			noti.error({
				message: "Failed to signup",
			});
			setSending(false);

			throw error;
		}
	};
	return (
		<section className="mx-auto mb-10 mt-4 flex w-[980px] items-center">
			{contextHolder}
			<div>
				<Image src={logo} alt="MyTVShow" width={100} height={100} />
			</div>
			<div>
				<Typography.Title level={3}>
					Sign up new account
				</Typography.Title>
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
						label="Password"
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
						label="Confirm password"
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
