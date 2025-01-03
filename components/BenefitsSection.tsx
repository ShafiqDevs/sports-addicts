import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const benefits = [
	'Save time with easy online booking',
	'Find the best pitches in your area',
	'Real-time availability updates',
	'Secure payment system',
	'24/7 customer support',
];

export default function BenefitsSection() {
	return (
		<section id='benefits-section' className='w-full py-12 md:py-24 lg:py-32 layoutXPadding bg-secondary'>
			<div className='container px-4 md:px-6'>
				<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
					Why Choose Us
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Card>
						<CardHeader>
							<CardTitle>Benefits of Using Our App</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className='space-y-2'>
								{benefits.map((benefit, index) => (
									<li
										key={index}
										className='flex items-center'>
										<CheckCircle className='w-5 h-5 mr-2 text-green-500' />
										{benefit}
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>How We Compare</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='mb-4'>
								Our app offers unique features that set us apart from
								the competition:
							</p>
							<ul className='list-disc list-inside space-y-2'>
								<li>Largest selection of pitches in the area</li>
								<li>User-friendly interface for quick bookings</li>
								<li>
									Integrated payment system for secure transactions
								</li>
								<li>Detailed pitch information and user reviews</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
