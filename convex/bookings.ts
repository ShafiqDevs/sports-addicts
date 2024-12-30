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

export const getBookingForPitchByDate = query({
	args: { booking_start: v.number(), pitch_id: v.string() },
	handler: async (ctx, { booking_start, pitch_id }) => {
		const booking = await ctx.db
			.query('bookings')
			// .withIndex('byBookingStart', (q) =>
			// 	q.gte('booking_start', booking_start)
			// )
			.filter((q) => q.eq(q.field('pitch_id'), pitch_id))
			.collect();
		return booking.length > 0 ? booking : null;
	},
});

export const getBookingsForPitchByDate = query({
	args: { booking_start: v.number(), pitch_id: v.string() },
	handler: async (ctx, { booking_start, pitch_id }) => {
		const startOfDay = new Date(booking_start);
		startOfDay.setHours(0, 0, 0, 0);
		const bookings = await ctx.db
			.query('bookings')
			.withIndex('byBookingStart')
			.filter((q) =>
				q.and(
					q.gte(q.field('booking_start'), startOfDay.getTime()),
					q.eq(q.field('pitch_id'), pitch_id)
				)
			)
			.collect();

		return await Promise.all(
			bookings.map(async (booking) => {
				const hostingUser = await ctx.db.get(booking.hostingUser_id);
				const pitch = await ctx.db.get(booking.pitch_id);
				return { ...booking, hostingUser, pitch };
			})
		);
	},
});
