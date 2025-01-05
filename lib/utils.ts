import { clsx, type ClassValue } from 'clsx';
import { ConvexHttpClient } from 'convex/browser';
import { twMerge } from 'tailwind-merge';
import { BookingWithUserData } from './types';
import {
	compareAsc,
	differenceInCalendarDays,
	differenceInDays,
} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
	throw new Error('NEXT_PUBLIC_CONVEX_URL is not set');
}

export const convex = new ConvexHttpClient(
	process.env.NEXT_PUBLIC_CONVEX_URL
);

export function groupedBookingByDateLabel(
	bookings: BookingWithUserData[]
) {
	if (bookings.length < 1) return [];

	const groupedBookings: Record<string, BookingWithUserData[]> = {};
	bookings.map((booking) => {
		const dayDifference = differenceInCalendarDays(
			new Date(),
			new Date(booking.booking_start)
		);

		console.log(
			`${new Date()} | ${new Date(booking.booking_start)} -> dayDifference:${dayDifference}`
		);
		let label;
		// if the dayDifference is greater than 0, it means the booking is in the past
		if (dayDifference > 0) {
			label =
				dayDifference === 1
					? `Yesterday`
					: `${dayDifference} ${dayDifference > 1 ? 'days' : 'day'} ago`;
		}
		// if the dayDifference is less than 0, it means the booking is in the future
		else if (dayDifference < 0) {
			label =
				dayDifference === -1
					? `Tomorrow`
					: `In ${Math.abs(dayDifference)} days`;
		} else label = 'Today';

		if (!groupedBookings[label]) groupedBookings[label] = [];
		groupedBookings[label].push(booking);
	});

	return groupedBookings;
}
