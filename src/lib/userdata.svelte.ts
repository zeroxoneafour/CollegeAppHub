import { College, type CollegeInfo } from "./colleges.svelte";

export class UserData {
	colleges: College[] = $state([]);
	readOnly: boolean = $state(false);

	toJSON(): object {
		return {
			colleges: this.colleges,
			readOnly: this.readOnly
		};
	}

	loadUserData(dataStr: string) {
		this.colleges = [];
		let data = JSON.parse(dataStr);
		for (const college of data.colleges) {
			this.colleges.push(College.fromJSON(college));
		}
		this.readOnly = data.readOnly;
	}

	saveUserData() {}
}

const userData = $state(new UserData());
export default userData;
