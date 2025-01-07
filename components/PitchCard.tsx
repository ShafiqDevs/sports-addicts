'use client';

import { useState, useEffect, useRef } from 'react';
import {
	motion,
	AnimatePresence,
	useAnimation,
	useMotionValue,
} from 'framer-motion';
import {
	Users,
	MapPin,
	ChevronLeft,
	ChevronRight,
	Star,
	Calendar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface PitchCardProps {
	_id: string;
	name: string;
	capacity: number;
	address: string;
	images: Id<'_storage'>[];
	rating: number;
	nextAvailable?: string;
}

export function PitchCard({
	_id,
	name,
	capacity,
	address,
	images: imageIDs,
	rating,
	nextAvailable,
}: PitchCardProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const constraintsRef = useRef(null);
	const x = useMotionValue(0);
	const controls = useAnimation();

	const images = useQuery(api.files.getFiles, {
		storageIds: imageIDs,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			if (!isHovered && images) {
				setCurrentIndex(
					(prevIndex) => (prevIndex + 1) % images.length
				);
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [isHovered, images]);

	const handleDragEnd = (event: any, info: any) => {
		const threshold = 50;
		if (info.offset.x > threshold && images) {
			setCurrentIndex(
				(prevIndex) => (prevIndex - 1 + images.length) % images.length
			);
		} else if (info.offset.x < -threshold && images) {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
		}
		controls.start({ x: 0 });
	};

	const formatCapacity = (capacity: number) =>
		`${capacity / 2}-a-side`;

	if (!images) return null;

	return (
		<Card className=' col-span-1 w-full overflow-hidden group'>
			<div
				className='relative aspect-[4/3] overflow-hidden'
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				ref={constraintsRef}>
				<AnimatePresence initial={false}>
					<motion.img
						key={currentIndex}
						src={images[currentIndex]}
						alt={`${name} - View ${currentIndex + 1}`}
						className='absolute inset-0 w-full h-full object-cover'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						drag='x'
						dragConstraints={constraintsRef}
						dragElastic={0.2}
						onDragEnd={handleDragEnd}
					/>
				</AnimatePresence>
				<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

				<div className='absolute top-2 left-2 flex gap-2'>
					<Badge
						variant='secondary'
						className='bg-black/50 text-white'>
						<Users className='w-3 h-3 mr-1' />
						{formatCapacity(capacity)}
					</Badge>
					<Badge
						variant='secondary'
						className='bg-primary/80 text-primary-foreground'>
						<Star className='w-3 h-3 mr-1' />
						{rating.toFixed(1)}
					</Badge>
				</div>

				<div className='absolute bottom-2 left-2 right-2 flex justify-between items-end'>
					<div>
						<h3 className='text-lg font-semibold text-white mb-1'>
							{name}
						</h3>
						<p className='text-sm text-white/80 flex items-center'>
							<MapPin className='w-3 h-3 mr-1' />
							{address}
						</p>
					</div>
					{/* <Badge
						variant='secondary'
						className='bg-black/50 text-white'>
						<Calendar className='w-3 h-3 mr-1' />
						{nextAvailable}
					</Badge> */}
				</div>

				{images.length > 1 && (
					<>
						<Button
							size='icon'
							variant='ghost'
							className='absolute top-1/2 left-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'
							onClick={() =>
								setCurrentIndex(
									(prevIndex) =>
										(prevIndex - 1 + images.length) % images.length
								)
							}>
							<ChevronLeft className='w-4 h-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className='absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'
							onClick={() =>
								setCurrentIndex(
									(prevIndex) => (prevIndex + 1) % images.length
								)
							}>
							<ChevronRight className='w-4 h-4' />
						</Button>
					</>
				)}
			</div>

			<CardContent className='p-4'>
				<Link
					href={`${ROUTES.play}/${_id}`}
					className='block w-full'>
					<Button className='w-full'>Book Now</Button>
				</Link>
			</CardContent>
		</Card>
	);
}
