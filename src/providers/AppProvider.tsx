"use client";

import { SessionProvider } from "next-auth/react";
import QueryClientProviderWrapper from "./QueryClientProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AntdRegistry>
			<SessionProvider>
				<QueryClientProviderWrapper>
					{children}
				</QueryClientProviderWrapper>
			</SessionProvider>
		</AntdRegistry>
	);
}
