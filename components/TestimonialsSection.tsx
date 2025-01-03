import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
	{
		name: 'John Doe',
		comment:
			'This app has made booking football pitches so much easier. Highly recommended!',
		rating: 5,
	},
	{
		name: 'Jane Smith',
		comment:
			'Great selection of pitches and super easy to use. Love it!',
		rating: 4,
	},
	{
		name: 'Mike Johnson',
		comment:
			'The real-time availability feature is a game-changer. No more double bookings!',
		rating: 5,
	},
];

export default function TestimonialsSection() {
	return (
		<section id='testimonials' className='w-full py-12 md:py-24 lg:py-32 layoutXPadding bg-secondary'>
			<div className='container px-4 md:px-6'>
				<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
					What Our Users Say
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{testimonials.map((testimonial, index) => (
						<Card key={index}>
							<CardHeader>
								<CardTitle>{testimonial.name}</CardTitle>
								<div className='flex'>
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star
											key={i}
											className='w-5 h-5 fill-yellow-400 text-yellow-400'
										/>
									))}
								</div>
							</CardHeader>
							<CardContent>
								<p>"{testimonial.comment}"</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
