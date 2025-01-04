import BookingsClient from '@/components/BookingClient';
import { api } from '@/convex/_generated/api';
import { convex } from '@/lib/utils';
import React from 'react';

type Props = {
	searchParams: Promise<{ [query: string]: string }>;
};

export default async function page({ searchParams }: Props) {
	const params = await searchParams;
	const { date = undefined, size = undefined } = params;
	console.log({ date, size });

	const response = await convex.query(
		api.bookings.getBookingsByFilter,
		{ date, size }
	);
	const bookings = response.data;
	if (!bookings) return <div>{response.message}</div>;
	else
		return (
			<main className='w-full h-full layoutXPadding overflow-hidden'>
				<BookingsClient bookings={bookings} />
			</main>
		);
}
