'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

export function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	const convexClient = new ConvexReactClient(
		process.env.NEXT_PUBLIC_CONVEX_URL!
	);

	return (
		<ConvexProvider client={convexClient}>{children}</ConvexProvider>
	);
}
