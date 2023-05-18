interface IUser {
	id: string;
	firstName?: string;
	lastName?: string;
	roles: ('admin' | 'user')[];
	email: string;
	createdAt: string;
	updatedAt: string;
}
