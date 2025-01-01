'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Users,
	MapPin,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

interface PitchCardProps {
	_id: string;
	name: string;
	capacity: number;
	address: string;
	images: string[];
}

const CAROUSELL_TIMER = 7000;

export function PitchCard({
	_id,
	name,
	capacity,
	address,
	images,
}: PitchCardProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (!isHovered && images.length > 1) {
			const timer = setInterval(() => {
				setCurrentImageIndex((prev) => (prev + 1) % images.length);
			}, CAROUSELL_TIMER);
			return () => clearInterval(timer);
		}
	}, [isHovered, images.length]);

	const formatCapacity = (capacity: number) => {
		const perSide = capacity / 2;
		return `${perSide}-a-side`;
	};

	return (
		<Card className='w-full h-full max-w-md overflow-hidden bg-background'>
			<div
				className='relative aspect-video'
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<AnimatePresence
					initial={false}
					mode='wait'>
					<motion.img
						key={currentImageIndex}
						src={images[currentImageIndex]}
						alt={`${name} - View ${currentImageIndex + 1}`}
						className='absolute inset-0 w-full h-full object-cover'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
					/>
				</AnimatePresence>
				{images.length > 1 && (
					<>
						<button
							onClick={() =>
								setCurrentImageIndex(
									(prev) => (prev - 1 + images.length) % images.length
								)
							}
							className='absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors'
							aria-label='Previous image'>
							<ChevronLeft className='h-3 w-3' />
						</button>
						<button
							onClick={() =>
								setCurrentImageIndex(
									(prev) => (prev + 1) % images.length
								)
							}
							className='absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors'
							aria-label='Next image'>
							<ChevronRight className='h-3 w-3' />
						</button>
						<div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1'>
							{images.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentImageIndex(index)}
									className={`w-2 h-2 rounded-full transition-colors ${
										index === currentImageIndex
											? 'bg-primary'
											: 'bg-background/80'
									}`}
									aria-label={`Go to image ${index + 1}`}
								/>
							))}
						</div>
					</>
				)}
			</div>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					<Link
						href={`${ROUTES.play}/${_id}`}
						className='flex flex-col md:flex-row items-center justify-between w-full'>
						<span>{name}</span>
						<Badge
							variant='secondary'
							className='flex items-center gap-1 shrink-0'>
							<Users className='h-4 w-4' />
							{formatCapacity(capacity)}
						</Badge>
					</Link>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Link
					href={`${ROUTES.play}/${_id}`}
					className='flex items-start gap-2 text-muted-foreground'>
					<MapPin className='h-4 w-4 mt-1 shrink-0' />
					<p className='text-sm line-clamp-2'>{address}</p>
				</Link>
			</CardContent>
		</Card>
	);
}
