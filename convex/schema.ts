import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	// Other tables here...
	users: defineTable({
		clerk_id: v.string(),
		user_name: v.string(),
		user_email: v.string(),
		user_profile_image_url: v.string(),
		// tasks: v.array(v.ref(tasks)),
		// Other fields here...
	}).index('byClerkId', ['clerk_id']),
	pitches: defineTable({
		name: v.string(),
		capacity: v.number(),
		address: v.string(),
		images: v.array(v.string()),
		description: v.string(),
	}),
	bookings: defineTable({
		hostingUser_id: v.id('users'),
		pitch_id: v.id('pitches'),
		booking_start: v.number(), // dates will be in timestamp format
		booking_end: v.number(), // dates will be in timestamp format
		status: v.union(
			v.literal('Available'),
			v.literal('Booked'),
			v.literal('Cancelled'),
			v.literal('Completed')
		), // Available, Booked, Cancelled, Completed
		// Other fields here...
	}).index('byBookingStart', ['booking_start']),
});
