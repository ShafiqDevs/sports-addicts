import Image from 'next/image';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Search, Calendar, MapPin } from 'lucide-react';

const features = [
	{
		title: 'Easy Search',
		description:
			'Find the perfect pitch in your area with our powerful search feature.',
		icon: Search,
	},
	{
		title: 'Quick Booking',
		description: 'Book your chosen pitch with just a few clicks.',
		icon: Calendar,
	},
	{
		title: 'Location Services',
		description: 'Get directions to your booked pitch easily.',
		icon: MapPin,
	},
];

export default function FeaturesSection() {
	return (
		<section
			id='features-section'
			className='w-full py-12 md:py-24 lg:py-32 layoutXPadding'>
			<div className='container px-4 md:px-6'>
				<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
					Key Features
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
					{features.map((feature, index) => (
						<Card key={index}>
							<CardHeader>
								<feature.icon className='w-10 h-10 mb-2 text-primary' />
								<CardTitle>{feature.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{feature.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
				<div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<h3 className='text-2xl font-bold mb-4'>
							App Screenshots
						</h3>
						<p className='mb-4'>
							Take a closer look at our intuitive interface and
							easy-to-use features.
						</p>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<Image
							src='/mobile_mockup_1.png'
							alt='App screenshot 1'
							width={300}
							height={600}
							className='rounded-lg shadow-md'
						/>
						<Image
							src='/mobile_mockup_2.png'
							alt='App screenshot 2'
							width={300}
							height={600}
							className='rounded-lg shadow-md'
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
