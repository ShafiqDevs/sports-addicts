import { v } from 'convex/values';
import { query } from './_generated/server';

export const getBookingByDate = query({
	args: { booking_start: v.number() },
	handler: async (ctx, { booking_start }) => {
		const booking = await ctx.db
			.query('bookings')
			.withIndex('byBookingStart', (q) =>
				q.gte('booking_start', booking_start)
			)
			.collect();
		return booking.length > 0 ? booking : null;
	},
});
