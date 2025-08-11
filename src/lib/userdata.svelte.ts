import { College, type CollegeInfo } from "./colleges.svelte";
import { browser } from "$app/environment";

export class UserData {
	colleges: College[] = $state([]);
	readOnly: boolean = $state(false);
	satScore: number = $state(1300);
	actScore: number = $state(28);

	toJSON(): object {
		return {
			colleges: this.colleges,
			readOnly: this.readOnly,
			satScore: this.satScore,
			actScore: this.actScore,
		};
	}

	loadUserData() {
		if (!browser) return;
		const dataStr = window.localStorage.getItem("userData");
		if (dataStr == null) return;
		let data = JSON.parse(dataStr);
		/*
		if (data.colleges != undefined) {
			this.colleges = [];
			for (const college of data.colleges) {
				this.colleges.push(College.fromJSON(college));
			}
		}
		if (data.readOnly != undefined) this.readOnly = data.readOnly;*/
	}

	saveUserData() {
		if (!browser) return;
		window.localStorage.setItem("userData", JSON.stringify(this.toJSON()));
	}
}

const userData = $state(new UserData());
export default userData;
