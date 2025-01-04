import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{ hostname: 'placehold.co', protocol: 'https' },
			{
				hostname: 'images.unsplash.com',
				protocol: 'https',
			},
			{
				hostname: 'dapper-mallard-357.convex.cloud',
				protocol: 'https',
			},
			{
				hostname: 'fearless-crow-657.convex.cloud',
				protocol: 'https',
			},
		],
	},
};

export default nextConfig;
