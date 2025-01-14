import { constants } from 'crypto';
import { query } from './_generated/server';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';
import { STATUS_CODES } from '@/lib/statusCodes';

export const getAllPitches = query({
	args: {},
	handler: async (ctx, args) => {
		const pitches = await ctx.db.query('pitches').collect();
		return pitches.length > 0 ? pitches : null;
	},
});

export const getPitchesByFilter = query({
	args: {
		size: v.optional(v.string()),
	},
	handler: async (ctx, { size }) => {
		let pitchesQuery: Doc<'pitches'>[];

		// Filter by size
		if (size === '5-a-side') {
			pitchesQuery = await ctx.db
				.query('pitches')
				.filter((q) => q.eq(q.field('capacity'), 10))
				.collect();
		} else if (size === '6-a-side') {
			pitchesQuery = await ctx.db
				.query('pitches')
				.filter((q) => q.eq(q.field('capacity'), 12))
				.collect();
		} else if (size === '8-a-side') {
			pitchesQuery = await ctx.db
				.query('pitches')
				.filter((q) => q.eq(q.field('capacity'), 16))
				.collect();
		} else if (size === '10-a-side') {
			pitchesQuery = await ctx.db
				.query('pitches')
				.filter((q) => q.eq(q.field('capacity'), 20))
				.collect();
		} else if (size === '11-a-side') {
			pitchesQuery = await ctx.db
				.query('pitches')
				.filter((q) => q.eq(q.field('capacity'), 22))
				.collect();
		} else {
			pitchesQuery = await ctx.db.query('pitches').collect();
		}

		if (pitchesQuery.length === 0) {
			return {
				message: 'No pitches found for the selected filter',
				data: null,
				status: STATUS_CODES.NOT_FOUND,
			};
		}

		return {
			message: 'Pitches found',
			data: pitchesQuery,
			status: STATUS_CODES.OK,
		};
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

// if the pitch does not exist, return a 404 status code
export const getPitchByIdWith404 = query({
	args: { id: v.id('pitches') },
	handler: async (ctx, { id }) => {
		const pitch = await ctx.db
			.query('pitches')
			.withIndex('by_id', (q) => q.eq('_id', id))
			.first();
		if (!pitch) {
			return {
				message: 'Pitch not found',
				data: null,
				status: STATUS_CODES.NOT_FOUND,
			};
		}
		return pitch;
	},
});

