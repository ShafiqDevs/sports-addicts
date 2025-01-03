import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
	{
		question: 'How do I book a pitch?',
		answer:
			"To book a pitch, simply search for available pitches in your area, select your preferred time slot, and confirm your booking. You'll receive a confirmation email with all the details.",
	},
	{
		question: 'Can I cancel my booking?',
		answer:
			'Yes, you can cancel your booking up to 24 hours before the scheduled time. Please refer to our cancellation policy for more details.',
	},
	{
		question: 'Is there a mobile app available?',
		answer:
			'Yes, we have mobile apps available for both iOS and Android devices. You can download them from the App Store or Google Play Store.',
	},
	{
		question: 'How do I pay for my booking?',
		answer:
			'We accept various payment methods including credit/debit cards and PayPal. All payments are processed securely through our platform.',
	},
];

export default function FAQSection() {
	return (
		<section id='faq-section' className='w-full py-12 md:py-24 lg:py-32 layoutXPadding'>
			<div className='container px-4 md:px-6'>
				<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
					Frequently Asked Questions
				</h2>
				<Accordion
					type='single'
					collapsible
					className='w-full max-w-3xl mx-auto'>
					{faqs.map((faq, index) => (
						<AccordionItem
							key={index}
							value={`item-${index}`}>
							<AccordionTrigger>{faq.question}</AccordionTrigger>
							<AccordionContent>{faq.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
