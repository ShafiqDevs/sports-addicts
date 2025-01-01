import { v } from 'convex/values';
import { query } from './_generated/server';

export const getFileUrl = query({
	args: { storageId: v.optional(v.id('_storage')) },
	handler: async (ctx, { storageId }) => {
		if (!storageId) return null;

		return await ctx.storage.getUrl(storageId);
	},
});

export const getFiles = query({
	args: { storageIds: v.array(v.id('_storage')) },
	handler: async (ctx, { storageIds }) => {
		const files = await Promise.all(
			storageIds.map((id) => ctx.storage.getUrl(id))
		);

		const finalFiles = files.filter((file) => file !== null);

		return finalFiles;
	},
});
