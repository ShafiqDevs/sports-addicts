import { v } from 'convex/values';
import {
	internalMutation,
	mutation,
	query,
} from './_generated/server';
import { STATUS_CODES } from '@/lib/statusCodes';
import { api, internal } from './_generated/api';
import {
	compareAsc,
	differenceInMinutes,
	endOfToday,
	endOfTomorrow,
	startOfToday,
	startOfTomorrow,
} from 'date-fns';
import { JOIN_CUTOFF_MINUTES } from '@/lib/constants';
import { Doc } from './_generated/dataModel';
import { BookingWithUserData } from '@/lib/types';
import { sendNotification } from '@/actions/userPushNotifications';

export const getAllBookings = query({
	args: {},
	handler: async (ctx) => {
		const bookings = await ctx.db.query('bookings').collect();
		if (bookings.length === 0)
			return {
				message: 'No bookings found',
				data: null,
				status: STATUS_CODES.NOT_FOUND,
			};
		else if (!bookings) {
			return {
				message: 'Whoops! Something went wrong',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		} else
			return {
				message: 'Bookings found',
				data: bookings,
				status: STATUS_CODES.OK,
			};
	},
});

export const getBookingsByFilter = query({
	args: {
		date: v.optional(v.string()),
		size: v.optional(v.string()),
	},
	handler: async (ctx, { date, size }) => {
		let bookings: BookingWithUserData[] = [];

		// Filter by date
		if (date) {
			const today = startOfToday().getTime();
			const tomorrow = startOfTomorrow().getTime();
			const endToday = endOfToday().getTime();
			const endTomorrow = endOfTomorrow().getTime();

			if (date === 'all') {
				const filteredBookings = await ctx.db
					.query('bookings')
					.withIndex('byBookingStart')
					.filter((q) =>
						q.and(
							q.neq(q.field('status'), 'Cancelled'),
							q.neq(q.field('status'), 'Completed')
						)
					)
					.order('desc')
					.collect();
				bookings = await Promise.all(
					filteredBookings.map(async (filteredBooking, index) => {
						const hostingUser = await ctx.db.get(
							filteredBooking.hostingUser_id
						);
						const pitch = await ctx.db.get(filteredBooking.pitch_id);
						return { ...filteredBooking, hostingUser, pitch };
					})
				);
			} else if (date === 'today') {
				const filteredBookings = await ctx.db
					.query('bookings')
					.withIndex('byBookingStart')
					.filter((q) =>
						q.and(
							q.gte(q.field('booking_start'), today),
							q.lte(q.field('booking_start'), endToday),
							q.and(
								q.neq(q.field('status'), 'Cancelled'),
								q.neq(q.field('status'), 'Completed')
							)
						)
					)
					.order('desc')
					.collect();
				bookings = await Promise.all(
					filteredBookings.map(async (filteredBooking, index) => {
						const hostingUser = await ctx.db.get(
							filteredBooking.hostingUser_id
						);
						const pitch = await ctx.db.get(filteredBooking.pitch_id);
						return { ...filteredBooking, hostingUser, pitch };
					})
				);
			} else if (date === 'tomorrow') {
				const filteredBookings = await ctx.db
					.query('bookings')
					.withIndex('byBookingStart')
					.filter((q) =>
						q.and(
							q.gte(q.field('booking_start'), tomorrow),
							q.lte(q.field('booking_start'), endTomorrow),
							q.and(
								q.neq(q.field('status'), 'Cancelled'),
								q.neq(q.field('status'), 'Completed')
							)
						)
					)
					.order('desc')
					.collect();
				bookings = await Promise.all(
					filteredBookings.map(async (filteredBooking, index) => {
						const hostingUser = await ctx.db.get(
							filteredBooking.hostingUser_id
						);
						const pitch = await ctx.db.get(filteredBooking.pitch_id);
						return { ...filteredBooking, hostingUser, pitch };
					})
				);
			}
		}
		// Filter by size
		else if (size) {
			const filteredBookings = await ctx.db
				.query('bookings')
				.withIndex('byBookingStart')
				.filter((q) =>
					q.and(
						q.eq(q.field('size'), size),
						q.and(
							q.neq(q.field('status'), 'Cancelled'),
							q.neq(q.field('status'), 'Completed')
						)
					)
				)
				.order('desc')
				.collect();
			bookings = await Promise.all(
				filteredBookings.map(async (filteredBooking, index) => {
					const hostingUser = await ctx.db.get(
						filteredBooking.hostingUser_id
					);
					const pitch = await ctx.db.get(filteredBooking.pitch_id);
					return { ...filteredBooking, hostingUser, pitch };
				})
			);
		} else {
			const filteredBookings = await ctx.db
				.query('bookings')
				.withIndex('byBookingStart')
				.filter((q) =>
					q.and(
						q.neq(q.field('status'), 'Cancelled'),
						q.neq(q.field('status'), 'Completed')
					)
				)
				.order('desc')
				.collect();
			bookings = await Promise.all(
				filteredBookings.map(async (filteredBooking, index) => {
					const hostingUser = await ctx.db.get(
						filteredBooking.hostingUser_id
					);
					const pitch = await ctx.db.get(filteredBooking.pitch_id);
					return { ...filteredBooking, hostingUser, pitch };
				})
			);
		}

		return {
			message: 'Bookings found',
			data: bookings,
			status: STATUS_CODES.OK,
		};
	},
});

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

export const getBookingById = query({
	args: { booking_id: v.id('bookings') },
	handler: async (ctx, { booking_id }) => {
		const booking = await ctx.db.get(booking_id);
		if (!booking) return null;
		return booking;
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

export const insertNewBooking = mutation({
	args: {
		booking_start: v.number(),
		booking_end: v.number(),
		pitch_id: v.id('pitches'),
		status: v.string(),
		auth_user_id: v.string(),
	},
	handler: async (
		ctx,
		{ booking_start, booking_end, auth_user_id, pitch_id, status }
	) => {
		const existingBooking = await ctx.db
			.query('bookings')
			.filter((q) =>
				q.and(
					q.eq(q.field('pitch_id'), pitch_id),
					q.eq(q.field('status'), 'Available'),
					q.or(
						q.and(
							q.lte(q.field('booking_start'), booking_start),
							q.gt(q.field('booking_end'), booking_start)
						),
						q.and(
							q.lt(q.field('booking_start'), booking_end),
							q.gte(q.field('booking_end'), booking_end)
						),
						q.and(
							q.gte(q.field('booking_start'), booking_start),
							q.lt(q.field('booking_end'), booking_end)
						),
						q.and(
							q.gte(q.field('booking_start'), booking_start),
							q.lt(q.field('booking_start'), booking_end)
						)
					)
				)
			)
			.first();
		if (existingBooking)
			return {
				message: 'Booking already exists',
				data: null,
				status: STATUS_CODES.CONFLICT,
			};

		if (compareAsc(new Date(), new Date(booking_start)) > 0) {
			return {
				message: 'Booking start time cannot be in the past',
				data: null,
				status: STATUS_CODES.CONFLICT,
			};
		}
		const user = await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('clerk_id'), auth_user_id))
			.first();

		const pitch = await ctx.db.get(pitch_id);

		if (user && pitch) {
			const sizeLabel =
				`${pitch.capacity / 2}-a-side` as Doc<'bookings'>['size'];
			const newBooking_id = await ctx.db.insert('bookings', {
				booking_start,
				booking_end,
				pitch_id,
				teamA: [user._id],
				teamB: [],
				size: sizeLabel,
				status: status as any,
				hostingUser_id: user._id,
			});
			const newBooking = await ctx.db.get(newBooking_id);
			if (!newBooking?.booking_end) {
				return {
					message: 'Booking had invlid end time',
					data: null,
					status: STATUS_CODES.INTERNAL_SERVER_ERROR,
				};
			}
			await ctx.scheduler.runAt(
				newBooking.booking_end,
				internal.bookings.cancelBooking_internal,
				{ booking_id: newBooking_id }
			);
			return {
				message: 'Booking created successfully',
				data: newBooking,
				status: STATUS_CODES.CREATED,
			};
		} else
			return {
				message: 'To host a booking you must be a registered user',
				data: null,
				status: STATUS_CODES.UNAUTHORIZED,
			};
	},
});

export const cancelBooking = mutation({
	args: { booking_id: v.id('bookings'), user_id: v.id('users') },
	handler: async (ctx, { booking_id, user_id }) => {
		const booking = await ctx.db.get(booking_id);
		if (!booking)
			return {
				message: 'Booking not found',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		else if (booking) {
			if (booking.hostingUser_id !== user_id)
				return {
					message: 'You are not authorized to cancel this booking',
					data: null,
					status: STATUS_CODES.UNAUTHORIZED,
				};
			await ctx.db.patch(booking_id, { status: 'Cancelled' });
			ctx.scheduler.runAfter(
				0,
				api.actions.sendNotificationFromConvex,
				{
					user_id,
					notification: {
						title: 'Booking Cancelled',
						body: 'Your booking has been cancelled',
					},
				}
			);
			return {
				message: 'Booking cancelled successfully',
				data: booking,
				status: STATUS_CODES.OK,
			};
		} else {
			return {
				message: 'Whoops.. Something went wrong',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

export const joinBooking = mutation({
	args: {
		booking_id: v.id('bookings'),
		side: v.string(),
		user_id: v.id('users'),
	},
	handler: async (ctx, { booking_id, side, user_id }) => {
		const booking = await ctx.db.get(booking_id);
		if (!booking) return null;

		const minUntilBookingStarts = differenceInMinutes(
			booking.booking_start,
			Date.now()
		);
		//TODO: Uncomment this
		// if (minUntilBookingStarts < JOIN_CUTOFF_MINUTES) {
		// 	return {
		// 		message:
		// 			'You cannot join or switch teams when the game is about to start',
		// 		data: null,
		// 		status: STATUS_CODES.CONFLICT,
		// 	};
		// }
		if (
			booking.status === 'Cancelled' ||
			booking.status === 'Completed'
		)
			return {
				message: 'Booking is not available',
				data: null,
				status: STATUS_CODES.CONFLICT,
			};
		const pitch = await ctx.db.get(booking.pitch_id);
		if (!pitch) return null;
		const teamCapacity = pitch.capacity / 2;
		if (side !== 'teamA' && side !== 'teamB') {
			throw new Error(
				'Invalid side. Must be either "teamA" or "teamB".'
			);
		}

		const updatedBooking = { ...booking };

		try {
			if (side === 'teamA') {
				if (booking.teamA.length < teamCapacity) {
					if (!updatedBooking.teamA.includes(user_id)) {
						updatedBooking.teamA.push(user_id);
						if (updatedBooking.teamB.includes(user_id))
							updatedBooking.teamB = booking.teamB.filter(
								(id) => id !== user_id
							);
					} else {
						return {
							message: `You are already in ${side}`,
							data: updatedBooking,
							status: STATUS_CODES.CONFLICT,
						};
					}
				} else {
					return {
						message: `${side} is full`,
						data: updatedBooking,
						status: STATUS_CODES.CONFLICT,
					};
				}
			} else {
				if (booking.teamB.length < teamCapacity) {
					if (!updatedBooking.teamB.includes(user_id)) {
						updatedBooking.teamB.push(user_id);
						if (updatedBooking.teamA.includes(user_id))
							updatedBooking.teamA = booking.teamA.filter(
								(id) => id !== user_id
							);
					} else {
						return {
							message: `You are already in ${side}`,
							data: updatedBooking,
							status: STATUS_CODES.CONFLICT,
						};
					}
				} else {
					return {
						message: `${side} is full`,
						data: updatedBooking,
						status: STATUS_CODES.CONFLICT,
					};
				}
			}
			if (
				updatedBooking.teamA.length + updatedBooking.teamB.length >=
				pitch.capacity
			) {
				updatedBooking.status = 'Booked';
			}
			await ctx.db.patch(booking_id, updatedBooking);
			return {
				message: `You have joined ${side}`,
				data: updatedBooking,
				status: STATUS_CODES.CREATED,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Whoops! Something went wrong',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

export const leaveBooking = mutation({
	args: {
		booking_id: v.id('bookings'),
		side: v.string(),
		user_id: v.id('users'),
	},
	handler: async (ctx, { booking_id, side, user_id }) => {
		const booking = await ctx.db.get(booking_id);
		if (!booking) return null;
		const updatedBooking = { ...booking };

		try {
			if (booking.hostingUser_id === user_id) {
				return {
					message: `You are hosting this booking. You cannot leave`,
					data: updatedBooking,
					status: STATUS_CODES.CONFLICT,
				};
			} else if (side === 'teamA') {
				if (updatedBooking.teamA.includes(user_id)) {
					updatedBooking.teamA = booking.teamA.filter(
						(id) => id !== user_id
					);
				} else {
					return {
						message: `You are not in ${side}`,
						data: updatedBooking,
						status: STATUS_CODES.CONFLICT,
					};
				}
			} else {
				if (updatedBooking.teamB.includes(user_id)) {
					updatedBooking.teamB = booking.teamB.filter(
						(id) => id !== user_id
					);
				} else {
					return {
						message: `You are not in ${side}`,
						data: updatedBooking,
						status: STATUS_CODES.CONFLICT,
					};
				}
			}
			await ctx.db.patch(booking_id, updatedBooking);
			const response = await ctx.runMutation(
				internal.waitinglist.EnterNextPlayerFromWaitingList,
				{ user_id, booking_id }
			);
			return {
				message: `You have left ${side}`,
				data: updatedBooking,
				status: STATUS_CODES.OK,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Whoops! Something went wrong',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

export const cancelBooking_internal = internalMutation({
	args: { booking_id: v.id('bookings') },
	handler: async (ctx, { booking_id }) => {
		const booking = await ctx.db.get(booking_id);
		if (!booking) return null;
		const updatedBooking = { ...booking };

		try {
			updatedBooking.status = 'Completed';
			await ctx.db.patch(booking_id, updatedBooking);
			return {
				message: `Booking has been cancelled`,
				data: updatedBooking,
				status: STATUS_CODES.OK,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Whoops! Something went wrong',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});
