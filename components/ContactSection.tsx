import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function ContactSection() {
	return (
		<section id='contact-section' className='w-full py-12 md:py-24 lg:py-32 layoutXPadding'>
			<div className='container px-4 md:px-6'>
				<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
					Get in Touch
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<h3 className='text-2xl font-bold mb-4'>Contact Us</h3>
						<form className='space-y-4'>
							<Input placeholder='Your Name' />
							<Input
								type='email'
								placeholder='Your Email'
							/>
							<Textarea placeholder='Your Message' />
							<Button type='submit'>Send Message</Button>
						</form>
					</div>
					<div>
						<h3 className='text-2xl font-bold mb-4'>Follow Us</h3>
						<p className='mb-4'>
							Stay connected with us on social media for the latest
							updates and offers.
						</p>
						<div className='flex space-x-4'>
							<a
								href='#'
								className='text-primary hover:text-primary-dark'>
								<Facebook className='w-6 h-6' />
							</a>
							<a
								href='#'
								className='text-primary hover:text-primary-dark'>
								<Twitter className='w-6 h-6' />
							</a>
							<a
								href='#'
								className='text-primary hover:text-primary-dark'>
								<Instagram className='w-6 h-6' />
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
