import { College } from "./colleges.svelte";
import { browser } from "$app/environment";

export interface UserData {
	colleges: College[];
	readOnly: boolean;
	satScore: number;
	actScore: number;
}

export class RealUserData implements UserData {
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

const userData = $state(new RealUserData());
export default userData;
