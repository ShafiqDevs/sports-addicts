'use server';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { convex } from '@/lib/utils';

export async function createBookingRequest(
	booking: Omit<
		Doc<'bookings'>,
		'_id' | '_creationTime' | 'hostingUser_id'
	>,
	auth_user_id: string
) {
	try {
		if (
			isNaN(new Date(booking.booking_start).getTime()) ||
			isNaN(new Date(booking.booking_end).getTime())
		) {
			throw new Error(
				'Invalid date format for booking_start or booking_end'
			);
		}

		const newBooking = await convex.mutation(
			api.bookings.insertNewBooking,
			{
				auth_user_id,
				booking_start: booking.booking_start,
				booking_end: booking.booking_end,
				pitch_id: booking.pitch_id,
				status: booking.status,
			}
		);

		return newBooking;
	} catch (error) {
		console.error('Error creating booking:', error);
		return {
			message: 'Error creating booking',
			data: null,
			status: 500,
		};
	}
}
