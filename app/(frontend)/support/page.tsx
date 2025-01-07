'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

import {
	MessageCircle,
	Phone,
	Mail,
	Clock,
	HelpCircle,
	BookOpen,
	Cog,
	MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters.' }),
	email: z.string().email({ message: 'Invalid email address.' }),
	subject: z.string().min(1, { message: 'Please select a subject.' }),
	message: z
		.string()
		.min(10, { message: 'Message must be at least 10 characters.' }),
});

const faqItems = [
	{
		question: 'How do I book a pitch?',
		answer:
			"You can book a pitch by navigating to the 'Play' section and selecting your preferred date and time.",
	},
	{
		question: 'What is your cancellation policy?',
		answer:
			'You can cancel your booking up to 24 hours before the scheduled time for a full refund.',
	},
	{
		question: 'How can I change my booking?',
		answer:
			"To change your booking, please go to the 'Bookings' section and select the booking you wish to modify.",
	},
	{
		question: 'Do you offer group discounts?',
		answer:
			'Yes, we offer discounts for group bookings of 5 or more pitches. Please contact our support team for more information.',
	},
];

export default function SupportPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			toast({
				title: 'Support request submitted',
				description: "We'll get back to you as soon as possible.",
			});
			form.reset();
		}, 2000);
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='space-y-8'>
				<Card>
					<CardHeader>
						<CardTitle className='text-3xl'>Support Center</CardTitle>
						<CardDescription>
							Get help from our support team or find answers in our
							FAQ.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center'>
										<Phone className='mr-2' />
										Phone Support
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>Call us: +1 (555) 123-4567</p>
									<p className='text-sm text-muted-foreground'>
										Mon-Fri, 9am-5pm
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center'>
										<Mail className='mr-2' />
										Email Support
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>Email us: support@sportsaddicts.com</p>
									<p className='text-sm text-muted-foreground'>
										24/7 support
									</p>
								</CardContent>
							</Card>
						</div>

						<div className='mb-6'>
							<h3 className='text-lg font-semibold mb-2'>
								Support Categories
							</h3>
							<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
								{[
									{ icon: HelpCircle, label: 'General Help' },
									{ icon: BookOpen, label: 'Bookings' },
									{ icon: Cog, label: 'Technical Support' },
									{ icon: MessageSquare, label: 'Feedback' },
								].map((item, index) => (
									<div
										key={index}
										className='flex flex-col items-center text-center'>
										<item.icon className='h-8 w-8 mb-2 text-primary' />
										<span className='text-sm'>{item.label}</span>
									</div>
								))}
							</div>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Submit a Support Request</CardTitle>
								<CardDescription>
									Fill out the form below to get help from our support
									team.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className='space-y-6'>
										<FormField
											control={form.control}
											name='name'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Name</FormLabel>
													<FormControl>
														<Input
															placeholder='John Doe'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='email'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															type='email'
															placeholder='john@example.com'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='subject'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subject</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select a subject' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value='general'>
																General Inquiry
															</SelectItem>
															<SelectItem value='booking'>
																Booking Issue
															</SelectItem>
															<SelectItem value='technical'>
																Technical Support
															</SelectItem>
															<SelectItem value='feedback'>
																Feedback
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='message'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Message</FormLabel>
													<FormControl>
														<Textarea
															placeholder='Please describe your issue or question in detail.'
															className='min-h-[100px]'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<div className='flex flex-col md:flex-row items-center justify-between gap-1'>
											<div className='flex items-center text-sm text-muted-foreground'>
												<Clock className='mr-1 h-4 w-4' />
												Estimated response time: 24 hours
											</div>
											<motion.div
												className='w-full flex justify-end'
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}>
												<Button
													className='max-sm:w-full'
													type='submit'
													disabled={isSubmitting}>
													{isSubmitting
														? 'Submitting...'
														: 'Submit Support Request'}
												</Button>
											</motion.div>
										</div>
									</form>
								</Form>
							</CardContent>
						</Card>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Frequently Asked Questions</CardTitle>
					</CardHeader>
					<CardContent>
						<Accordion
							type='single'
							collapsible
							className='w-full'>
							{faqItems.map((item, index) => (
								<AccordionItem
									value={`item-${index}`}
									key={index}>
									<AccordionTrigger>{item.question}</AccordionTrigger>
									<AccordionContent>{item.answer}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</Card>
			</motion.div>

			{/* Live Chat Button */}
			<motion.div
				className='fixed bottom-4 right-4'
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 1 }}>
				<Button
					onClick={() => setShowChat(!showChat)}
					className='rounded-full w-12 h-12 p-0'>
					<MessageCircle />
				</Button>
			</motion.div>

			{/* Live Chat Window (placeholder) */}
			{showChat && (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 50 }}
					className='fixed bottom-20 right-4 w-80 h-96 bg-background border rounded-lg shadow-lg p-4'>
					<h3 className='text-lg font-semibold mb-2 w-full text-center'>
						Live Chat
					</h3>
					<div className='flex flex-col justify-start items-center w-full h-full'>
						<p>Live Chat coming soon</p>
					</div>
				</motion.div>
			)}
		</div>
	);
}
