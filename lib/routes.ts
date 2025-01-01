export const ROUTES = {
	checkout: {
		success: `${`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` || process.env.NEXT_PUBLIC_BASE_URL}/success`,
		fail: `${`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` || process.env.NEXT_PUBLIC_BASE_URL}/fail`,
	},
	support: `/support`,
	play: `/play`,
	bookings: `/bookings`,
};
