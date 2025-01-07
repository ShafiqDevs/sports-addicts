import React from 'react';
import { Card, CardContent } from './ui/card';
import { CalendarPlus } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

type Props = {
	withAction: boolean;
};

function NoBookingsUI({ withAction }: Props) {
	return (
		<div className='container mx-auto px-4 py-8 max-w-md'>
			<Card className='bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<CardContent className='pt-6 pb-8 px-6 flex flex-col items-center text-center'>
					<CalendarPlus className='h-12 w-12 text-muted-foreground mb-4' />
					<h2 className='text-2xl font-semibold mb-2'>
						No Bookings Yet
					</h2>
					<p className='text-muted-foreground mb-6'>
						You haven't made any bookings. Start by creating your
						first one!
					</p>
					{withAction && (
						<Button
							asChild
							className='w-full sm:w-auto'>
							<Link href={ROUTES.play}>Create New Booking</Link>
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default NoBookingsUI;
