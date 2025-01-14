import { Doc } from '@/convex/_generated/dataModel';

export type BookingWithUserData = Doc<'bookings'> & {
	hostingUser: Doc<'users'> | null;
	pitch: Doc<'pitches'> | null;
};

export type NotificationSubscriptionObject = {
	[key: string]: {
		endpoint: string;
		expirationTime?: null | string;
		keys: {
			p256dh: string;
			auth: string;
		};
	};
};

export type WaitingListWithUserData = Doc<'waitinglist'> & {
	user: Doc<'users'> | null;
};
