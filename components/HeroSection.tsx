'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function HeroSection() {
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.48, 0.15, 0.25, 0.96],
			},
		},
	};

	return (
		<motion.section
			id='hero-section'
			className='relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10'
			initial='hidden'
			animate={inView ? 'visible' : 'hidden'}
			variants={containerVariants}
			ref={ref}>
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0 bg-grid-pattern opacity-10'></div>
				<div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent'></div>
			</div>

			<div className='relative z-10 container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-12'>
				<motion.div
					className='flex flex-col items-start space-y-6 text-left max-w-2xl'
					variants={itemVariants}>
					<motion.h1
						className='text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground'
						variants={itemVariants}>
						Book Your Perfect{' '}
						<span className='text-primary'>Pitch</span>
					</motion.h1>
					<motion.p
						className='text-lg sm:text-xl text-muted-foreground'
						variants={itemVariants}>
						Find and reserve the best football pitches in your area.
						Easy booking, great games, unforgettable moments.
					</motion.p>
					<motion.div
						className='flex flex-wrap gap-4'
						variants={itemVariants}>
						<Button
							variant='default'
							size='lg'
							className='rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300'
							asChild>
							<Link href='/play'>Get Started</Link>
						</Button>
						<Button
							variant='outline'
							size='lg'
							className='rounded-full shadow-md hover:shadow-lg transition-shadow duration-300'
							asChild>
							<Link href='#how-it-works'>Learn More</Link>
						</Button>
					</motion.div>
				</motion.div>

				<motion.div
					className='relative w-full max-w-lg'
					variants={itemVariants}>
					<div className='absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
					<div className='absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
					<div className='absolute -bottom-8 left-20 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
					<motion.div
						className='relative'
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.6,
							delay: 0.2,
							ease: [0.48, 0.15, 0.25, 0.96],
						}}>
						<Image
							src='https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							alt='Football pitch'
							width={600}
							height={400}
							className='rounded-2xl shadow-2xl'
						/>
					</motion.div>
				</motion.div>
			</div>
		</motion.section>
	);
}
