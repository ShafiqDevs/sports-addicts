import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const RegisterNewUser = mutation({
	args: { clerk_id: v.string() },
	handler: async (ctx, { clerk_id }) => {
		// check if user already exists
		const user = await ctx.db
			.query('users')
			.withIndex('byClerkId')
			.first();
		if (user) return;
		// create new user record in the database
		await ctx.db.insert('users', { clerk_id });
	},
});
