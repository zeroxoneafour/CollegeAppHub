import { College } from "./colleges.svelte";

export class UserData {
	colleges: College[] = $state([]);
	readOnly: boolean = $state(false);

	toJSON(): object {
		return {
			colleges: this.colleges,
			readOnly: this.readOnly
		};
	}
}

const userData = new UserData();
export default userData;

export function loadUserData(dataStr: string) {
	let data = JSON.parse(dataStr);
	for (const d in data) {
		(userData as any)[d] = data[d];
	}
}

export function saveUserData(data: UserData) {}
