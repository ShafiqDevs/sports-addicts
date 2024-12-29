import { constants } from 'crypto';
import { query } from './_generated/server';

export const getAllPitches = query({
	args: {},
	handler: async (ctx, args) => {
		const pitches = await ctx.db.query('pitches').collect();
		return pitches.length > 0 ? pitches : null;
	},
});
