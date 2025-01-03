'use client';

import { useActionState, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { addHours, nextMonday, nextSaturday, set } from 'date-fns';
import Form from 'next/form';

type Props = {
	selectedTimeStamp: number;
	submitBookingRequest: (booking: {
		selectedDateTime_start: Date;
		selectedDateTime_end: Date;
	}) => void;
};

export default function DateTimePicker({
	selectedTimeStamp,
	submitBookingRequest,
}: Props) {
	const router = useRouter();
	// duration in hours
	const [duration, setDuration] = useState<number>(1);
	// booking dateTime Start & End
	const [selectedDateTime_start, setSelectedDateTime_start] =
		useState<Date>(new Date(selectedTimeStamp));
	const [selectedDateTime_end, setSelectedDateTime_end] =
		useState<Date | null>(null);

	const [state, formAction, pending] = useActionState(
		async () =>
			submitBookingRequest({
				selectedDateTime_start,
				selectedDateTime_end: selectedDateTime_end || new Date(),
			}),
		null
	);

	function navigateToDate(date: Date) {
		const newDateTime = date;
		newDateTime.setHours(
			selectedDateTime_start.getHours(),
			selectedDateTime_start.getMinutes(),
			0,
			0
		);
		setSelectedDateTime_start(newDateTime);
		const matchedEndDate = selectedDateTime_end;
		matchedEndDate?.setDate(newDateTime.getDate());
		setSelectedDateTime_end(matchedEndDate);
		const url = new URL(window.location.href);
		url.searchParams.set(
			'booking_date',
			newDateTime.getTime().toString()
		);
		router.push(url.toString(), { scroll: false }); // Update URL and rerender on the server
	}

	const handleRangeSelection = (
		range: 'today' | 'next_week' | 'this_weekend'
	) => {
		const now = new Date();
		switch (range) {
			case 'today':
				navigateToDate(now);
				break;
			case 'next_week':
				navigateToDate(nextMonday(now));
				break;
			case 'this_weekend': // Assuming Saturday as the weekend start
				navigateToDate(nextSaturday(now));
				break;
			default:
				break;
		}
	};

	return (
		<Card className='w-full max-w-4xl mx-auto bg-background'>
			<CardHeader className='px-2 pb-2'>
				<CardTitle className='text-2xl font-bold text-primary flex flex-col gap-1'>
					<span>Book Your Football Game</span>
					<span className='text-sm text-muted-foreground font-light'>
						(use the calendar to browse upcoming bookings)
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className='p-2'>
				<Form
					action={async () => {
						if (!selectedDateTime_end || !selectedDateTime_start)
							return;
						formAction();
						// submitBookingRequest({
						// 	selectedDateTime_start,
						// 	selectedDateTime_end,
						// });
						setSelectedDateTime_end(null);
					}}>
					<div className='flex flex-col-reverse md:flex-row flex-wrap-reverse w-full gap-6'>
						<div className='flex-1 w-full b'>
							<Calendar
								className='rounded-md border border-input w-full'
								mode='single'
								selected={selectedDateTime_start}
								onSelect={(newDate) => {
									if (newDate) {
										const newDateTime = new Date(newDate);
										newDateTime.setHours(
											selectedDateTime_start.getHours(),
											selectedDateTime_start.getMinutes(),
											0,
											0
										);
										setSelectedDateTime_start(newDateTime);
										const matchedEndDate = selectedDateTime_end;
										matchedEndDate?.setDate(newDateTime.getDate());
										setSelectedDateTime_end(matchedEndDate);
										const url = new URL(window.location.href);
										url.searchParams.set(
											'booking_date',
											newDateTime.getTime().toString()
										);
										router.push(url.toString(), { scroll: false }); // Update URL and rerender on the server
									}
								}}
							/>
						</div>
						<div className='w-full md:w-48 space-y-4 '>
							<Button
								onClick={() => {
									handleRangeSelection('today');
								}}
								variant='outline'
								className='w-full justify-start text-left font-normal'>
								Today
							</Button>
							<Button
								onClick={() => handleRangeSelection('next_week')}
								variant='outline'
								className='w-full justify-start text-left font-normal'>
								Next Week
							</Button>
							<Button
								onClick={() => handleRangeSelection('this_weekend')}
								variant='outline'
								className='w-full justify-start text-left font-normal'>
								This Weekend
							</Button>
						</div>
					</div>
					<div className='mt-6 space-y-4'>
						<div>
							<label
								htmlFor='time-select'
								className='block text-sm font-medium text-muted-foreground mb-2'>
								Select Time
							</label>
							<Select
								onValueChange={(value) => {
									const [hours, minutes] = value
										.split(':')
										.map(Number);
									const newDateTime = new Date(
										selectedDateTime_start
									);
									newDateTime.setHours(hours, minutes, 0, 0);
									setSelectedDateTime_start(newDateTime);
									setSelectedDateTime_end(
										addHours(newDateTime, duration)
									);
								}}
								value={`${selectedDateTime_start
									.getHours()
									.toString()
									.padStart(2, '0')}:${selectedDateTime_start
									.getMinutes()
									.toString()
									.padStart(2, '0')}`}>
								<SelectTrigger
									id='time-select'
									className='w-full'>
									<SelectValue placeholder='Select time' />
								</SelectTrigger>
								<SelectContent>
									{Array.from({ length: 24 }, (_, i) => i).map(
										(hour) => (
											<SelectItem
												key={hour}
												value={`${hour
													.toString()
													.padStart(2, '0')}:00`}>
												{`${hour.toString().padStart(2, '0')}:00`}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div>
						<div>
							<label
								htmlFor='duration-select'
								className='block text-sm font-medium text-muted-foreground mb-2'>
								Select Duration
							</label>
							<Select
								onValueChange={(value) => {
									setDuration(parseInt(value));
									setSelectedDateTime_end(
										addHours(selectedDateTime_start, parseInt(value))
									);
								}}
								value={`${duration}`}>
								<SelectTrigger
									id='duration-select'
									className='w-full'>
									<SelectValue placeholder='Select duration' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='1'>1 hour</SelectItem>
									<SelectItem value='2'>2 hours</SelectItem>
									<SelectItem value='3'>3 hours</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className='flex flex-col gap-1 group relative'>
						<Button
							type='submit'
							className='w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90'
							disabled={!selectedDateTime_end || pending}>
							{pending ? 'Hold on...' : 'Book Now'}
						</Button>
						{!selectedDateTime_end && (
							<span className='text-center text-xs text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
								Complete booking information
							</span>
						)}
					</div>
				</Form>
			</CardContent>
		</Card>
	);
}
