import { v } from 'convex/values';
import {
	internalMutation,
	mutation,
	query,
} from './_generated/server';
import { STATUS_CODES } from '@/lib/statusCodes';
import { WaitingListWithUserData } from '@/lib/types';

export const getBookingWaitingList = query({
	args: { booking_id: v.optional(v.id('bookings')) },
	handler: async (ctx, { booking_id }) => {
		if (!booking_id)
			return {
				message: 'Booking id is required',
				data: null,
				status: STATUS_CODES.BAD_REQUEST,
			};
		try {
			const waitingList = await ctx.db
				.query('waitinglist')
				.filter((q) => q.eq(q.field('booking'), booking_id))
				.order('asc')
				.collect();
			if (!waitingList) {
				return {
					message: 'No one is waiting yet',
					data: [],
					status: STATUS_CODES.OK,
				};
			}

			const waitingListWithUserData: WaitingListWithUserData[] = [];
			await Promise.all(
				waitingList.map(async (waitingEntry) => {
					const user = await ctx.db.get(waitingEntry.user_id);
					if (user) {
						let waitingEntryWithUserData: WaitingListWithUserData = {
							...waitingEntry,
							user,
						};
						waitingListWithUserData.push(waitingEntryWithUserData);
					}
				})
			);

			return {
				message: 'Waiting list fetched successfully',
				data: waitingListWithUserData,
				status: STATUS_CODES.OK,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Failed to fetch waiting list',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

export const enterWaitingList = mutation({
	args: { user_id: v.id('users'), booking_id: v.id('bookings') },
	handler: async (ctx, { user_id, booking_id }) => {
		try {
			const waitingEntry = await ctx.db
				.query('waitinglist')
				.filter((q) =>
					q.and(
						q.eq(q.field('booking'), booking_id),
						q.eq(q.field('user_id'), user_id)
					)
				)
				.first();
			if (waitingEntry) {
				return {
					message: 'User already in waiting list',
					data: null,
					status: STATUS_CODES.CONFLICT,
				};
			}
			await ctx.db.insert('waitinglist', {
				user_id,
				booking: booking_id,
			});
			return {
				message: 'User added to waiting list',
				data: null,
				status: STATUS_CODES.CREATED,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Failed to add user to waiting list',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

export const leaveWaitingList = mutation({
	args: { user_id: v.id('users'), booking_id: v.id('bookings') },
	handler: async (ctx, { user_id, booking_id }) => {
		try {
			const waitingEntry = await ctx.db
				.query('waitinglist')
				.filter((q) =>
					q.and(
						q.eq(q.field('booking'), booking_id),
						q.eq(q.field('user_id'), user_id)
					)
				)
				.first();
			if (!waitingEntry) {
				return {
					message: 'User not in waiting list',
					data: null,
					status: STATUS_CODES.NOT_FOUND,
				};
			}
			await ctx.db.delete(waitingEntry._id);
			return {
				message: 'User removed from waiting list',
				data: null,
				status: STATUS_CODES.OK,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Failed to remove user from waiting list',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

export const EnterNextPlayerFromWaitingList = internalMutation({
	args: { booking_id: v.id('bookings'), user_id: v.id('users') },
	handler: async (ctx, { booking_id, user_id }) => {
		try {
			const waitingEntry = await ctx.db
				.query('waitinglist')
				.filter((q) => q.eq(q.field('booking'), booking_id))
				.order('asc')
				.first();
			if (!waitingEntry) {
				return {
					message: 'No one is waiting',
					data: null,
					status: STATUS_CODES.NOT_FOUND,
				};
			}
			const booking = await ctx.db.get(booking_id);
			if (!booking) {
				return {
					message: 'Booking not found',
					data: null,
					status: STATUS_CODES.NOT_FOUND,
				};
			}
			let updatedBooking = booking;
			if (booking.teamA.length <= booking.teamB.length) {
				updatedBooking.teamA.push(waitingEntry.user_id);
			} else {
				updatedBooking.teamB.push(waitingEntry.user_id);
			}
			await ctx.db.patch(booking_id, updatedBooking);

			await ctx.db.delete(waitingEntry._id);
			return {
				message: 'User removed from waiting list',
				data: null,
				status: STATUS_CODES.OK,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Failed to remove user from waiting list',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});
