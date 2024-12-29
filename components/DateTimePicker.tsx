'use client';

import { useEffect, useState } from 'react';
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

export default function DateTimePicker() {
	const [selectedDateTime, setSelectedDateTime] = useState<Date>(
		new Date()
	);
	const [duration, setDuration] = useState<string>('1');

	const handleRangeSelection = (range: 'today' | 'week') => {
		const now = new Date();
		if (range === 'today') {
			setSelectedDateTime(now);
		} else if (range === 'week') {
			const endOfWeek = new Date(now);
			endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
			setSelectedDateTime(endOfWeek);
		}
	};

	useEffect(() => {
		console.log(selectedDateTime.toISOString());
	}, [selectedDateTime]);

	return (
		<Card className='w-full max-w-4xl mx-auto bg-background'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold text-primary'>
					Book Your Football Game
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col md:flex-row gap-6'>
					<div className='flex-1'>
						<Calendar
							mode='single'
							selected={selectedDateTime}
							onSelect={(newDate) => {
								if (newDate) {
									const newDateTime = new Date(newDate);
									newDateTime.setHours(
										selectedDateTime.getHours(),
										selectedDateTime.getMinutes(),
										0,
										0
									);
									setSelectedDateTime(newDateTime);
								}
							}}
							className='rounded-md border border-input'
						/>
					</div>
					<div className='w-full md:w-48 space-y-4'>
						<Button
							onClick={() => handleRangeSelection('today')}
							variant='outline'
							className='w-full justify-start text-left font-normal'>
							Today
						</Button>
						<Button
							onClick={() => handleRangeSelection('week')}
							variant='outline'
							className='w-full justify-start text-left font-normal'>
							This Week
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
								const [hours, minutes] = value.split(':').map(Number);
								const newDateTime = new Date(selectedDateTime);
								newDateTime.setHours(hours, minutes, 0, 0);
								setSelectedDateTime(newDateTime);
							}}
                            
							value={`${selectedDateTime
								.getHours()
								.toString()
								.padStart(2, '0')}:${selectedDateTime
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
							onValueChange={setDuration}
							value={duration}>
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
				<Button className='w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90'>
					Book Now
				</Button>
			</CardContent>
		</Card>
	);
}
