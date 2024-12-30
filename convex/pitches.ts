import { constants } from 'crypto';
import { query } from './_generated/server';
import { v } from 'convex/values';

export const getAllPitches = query({
	args: {},
	handler: async (ctx, args) => {
		const pitches = await ctx.db.query('pitches').collect();
		return pitches.length > 0 ? pitches : null;
	},
});

export const getPitchById = query({
	args: { id: v.id('pitches') },
	handler: async (ctx, { id }) => {
		const pitch = await ctx.db
			.query('pitches')
			.withIndex('by_id', (q) => q.eq('_id', id))
			.first();
		return pitch ? pitch : null;
	},
});
