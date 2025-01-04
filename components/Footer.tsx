'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Github,
	Send,
} from 'lucide-react';

const footerLinks = [
	{
		title: 'Company',
		links: [
			{ name: 'About', href: '/about' },
			{ name: 'Careers', href: '/careers' },
			{ name: 'Contact', href: '/contact' },
			{ name: 'Blog', href: '/blog' },
		],
	},
	{
		title: 'Legal',
		links: [
			{ name: 'Terms', href: '/terms' },
			{ name: 'Privacy', href: '/privacy' },
			{ name: 'Cookies', href: '/cookies' },
			{ name: 'Licenses', href: '/licenses' },
		],
	},
	{
		title: 'Support',
		links: [
			{ name: 'Help Center', href: '/help' },
			{ name: 'FAQs', href: '/faqs' },
			{ name: 'Community', href: '/community' },
			{ name: 'Feedback', href: '/feedback' },
		],
	},
];

const socialLinks = [
	{ name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
	{ name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
	{
		name: 'Instagram',
		icon: Instagram,
		href: 'https://instagram.com',
	},
	{ name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
	{ name: 'GitHub', icon: Github, href: 'https://github.com' },
];

export default function Footer() {
	const [email, setEmail] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle newsletter signup logic here
		console.log('Signed up with email:', email);
		setEmail('');
	};

	return (
		<footer className='w-full bg-background border-t'>
			<div className='container mx-auto px-6 py-12 h-full'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='space-y-4'>
						<h2 className='text-2xl font-bold'>PitchPerfect</h2>
						<p className='text-muted-foreground'>
							Book your perfect football pitch anytime, anywhere.
						</p>
						<form
							onSubmit={handleSubmit}
							className='flex space-x-2'>
							<Input
								type='email'
								placeholder='Enter your email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='flex-grow'
								required
							/>
							<Button
								type='submit'
								size='icon'>
								<Send className='h-4 w-4' />
							</Button>
						</form>
					</div>
					{footerLinks.map((column) => (
						<div key={column.title}>
							<h3 className='font-semibold text-lg mb-4'>
								{column.title}
							</h3>
							<ul className='space-y-2'>
								{column.links.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className='text-muted-foreground hover:text-primary transition-colors'>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className='mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center'>
					<p className='text-muted-foreground text-sm'>
						© 2023 PitchPerfect. All rights reserved.
					</p>
					<div className='flex space-x-4 mt-4 md:mt-0'>
						{socialLinks.map((link) => (
							<motion.a
								key={link.name}
								href={link.href}
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary transition-colors'
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}>
								<link.icon className='h-5 w-5' />
								<span className='sr-only'>{link.name}</span>
							</motion.a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
