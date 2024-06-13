export interface Task {
	id?: number;
	type: string;
	schedule: string;
	status?: string;
	created_at?: Date;
	updated_at?: Date;
}
