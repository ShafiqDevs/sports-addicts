import { Doc } from '@/convex/_generated/dataModel';

export type BookingWithUserData = Doc<'bookings'> & {
	hostingUser: Doc<'users'> | null;
	pitch: Doc<'pitches'> | null;
};
