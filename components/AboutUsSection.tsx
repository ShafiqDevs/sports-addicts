import Image from 'next/image';

export default function AboutUsSection() {
	return (
		<section
			id='about-us'
			className='w-full py-12 md:py-24 lg:py-32 layoutXPadding bg-secondary'>
			<div className='container px-4 md:px-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
					<div>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4'>
							About Us
						</h2>
						<p className='text-xl text-muted-foreground mb-4'>
							We're passionate about making sports accessible to
							everyone. Our app was born out of the frustration of
							trying to find and book football pitches easily.
						</p>
						<p className='text-xl text-muted-foreground mb-4'>
							Our mission is to connect sports enthusiasts with great
							facilities, making the process of organizing games as
							simple as possible.
						</p>
						<p className='text-xl text-muted-foreground'>
							Join us in our journey to revolutionize the way people
							book and play sports!
						</p>
					</div>
					<div className='flex justify-center'>
						<Image
							src='/who_we_are.jpg'
							alt='Our Team'
							width={400}
							height={400}
							className='rounded-lg shadow-lg'
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
