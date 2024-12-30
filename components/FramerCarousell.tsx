'use client';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';

type Props = {
	imageAltText?: string;
	images: string[];
};

function FramerCarousell({ images, imageAltText }: Props) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	return (
		<Card className='w-full max-w-md overflow-hidden bg-background'>
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
						alt={`View ${currentImageIndex + 1}`}
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
							<ChevronLeft className='h-4 w-4' />
						</button>
						<button
							onClick={() =>
								setCurrentImageIndex(
									(prev) => (prev + 1) % images.length
								)
							}
							className='absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors'
							aria-label='Next image'>
							<ChevronRight className='h-4 w-4' />
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
		</Card>
	);
}

export default FramerCarousell;
