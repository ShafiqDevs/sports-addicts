import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterSection() {
	return (
		<section id='newsletter' className='w-full py-12 md:py-24 lg:py-32 layoutXPadding bg-secondary'>
			<div className='container px-4 md:px-6'>
				<div className='flex flex-col items-center space-y-4 text-center'>
					<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
						Stay Updated
					</h2>
					<p className='mx-auto max-w-[700px] text-foreground md:text-xl'>
						Subscribe to our newsletter for exclusive offers, tips,
						and the latest news about sports facilities in your area.
					</p>
					<div className='w-full max-w-sm space-y-2'>
						<form className='flex space-x-2'>
							<Input
								type='email'
								placeholder='Enter your email'
								className='flex-grow'
							/>
							<Button
								type='submit'
								variant='outline'>
								Subscribe
							</Button>
						</form>
					</div>
					<p className='text-sm text-foreground font-light'>
						By subscribing, you agree to our Terms of Service and
						Privacy Policy.
					</p>
				</div>
			</div>
		</section>
	);
}
