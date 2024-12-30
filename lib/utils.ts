import { clsx, type ClassValue } from 'clsx';
import { ConvexHttpClient } from 'convex/browser';
import { twMerge } from 'tailwind-merge';
import { BookingWithUserData } from './types';
import {
	compareAsc,
	differenceInCalendarDays,
	differenceInDays,
} from 'date-fns';
import { group } from 'console';

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

		const label =
			dayDifference === 0
				? 'Today'
				: dayDifference === 1
					? 'Tomorrow'
					: /// if the dayDifference is less than 0, it means the booking is in the future
						dayDifference < 0
						? dayDifference === -1
							? `Tomorrow`
							: `In ${Math.abs(dayDifference)} days`
						: `${Math.abs(dayDifference)} days ago`;

		if (!groupedBookings[label]) groupedBookings[label] = [];
		groupedBookings[label].push(booking);
	});

	return groupedBookings;
}
