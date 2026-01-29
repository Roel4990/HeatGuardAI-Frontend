"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RealTimeControlLayout } from "@/app/dashboard/realTimeControl/components/realtimecontrollayout";

export default function Page(): React.JSX.Element {
	const [queryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<RealTimeControlLayout />
		</QueryClientProvider>
	);
}
