import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function HeroSection() {
	return (
		<section
			id='hero-section'
			className='w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary layoutXPadding'>
			<div className='container px-4 md:px-6'>
				<div className='flex flex-col items-center space-y-4 text-center'>
					<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary'>
						Book Your Perfect Pitch
					</h1>
					<p className='mx-auto max-w-[700px] text-foreground md:text-xl'>
						Find and reserve the best football pitches in your area.
						Easy booking, great games.
					</p>
					<div className='space-x-4'>
						<Button
							variant={'default'}
							size='lg'
							className=''>
							<Link href={ROUTES.play}>Get Started</Link>
						</Button>
						<Button
							size='lg'
							variant='outline'
							className=''>
							<Link href='#how-it-works'>
								Learn More
							</Link>
						</Button>
					</div>
				</div>
			</div>
			<div className='mt-12 flex justify-center'>
				<Image
					src='https://placehold.co/600x400/png'
					alt='App showcase'
					width={600}
					height={400}
					className='rounded-lg shadow-lg'
				/>
			</div>
		</section>
	);
}
