import { College } from "./colleges.svelte";
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
			actScore: this.actScore
		};
	}

	toString(): string {
		return JSON.stringify(this.toJSON());
	}

	loadUserData(dataStr: string) {
		let data = JSON.parse(dataStr);

		this.colleges = data.colleges?.map((x: object) => College.fromJSON(x)) ?? this.colleges;
		this.readOnly = data.readOnly ?? this.readOnly;
		this.satScore = data.satScore ?? this.satScore;
		this.actScore = data.actScore ?? this.actScore;
	}

	loadLocalStorage() {
		if (!browser) return;
		this.loadUserData(window.localStorage.getItem("userData") ?? "{}");
	}

	saveLocalStorage() {
		if (!browser) return;
		window.localStorage.setItem("userData", this.toString());
	}
}

const mainUserData = $state(new UserData());

class UserDataManager {
	data: Map<string, UserData> = new Map();

	get(id: string): UserData {
		if (this.data.has(id)) return this.data.get(id)!;
		const newData = new UserData();
		this.data.set(id, newData);
		return newData;
	}
}

export const userDataManager = new UserDataManager();
export default mainUserData;
