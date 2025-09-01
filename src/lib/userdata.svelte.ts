import { College } from "./colleges.svelte";
import firebaseManager from "./firebase.svelte";

export class UserData {
	colleges: College[] = $state([]);
	satScore: number = $state(1300);
	actScore: number = $state(28);
	publicUpload: boolean = $state(false);

	toJSON(): object {
		return {
			colleges: this.colleges.map((x) => x.toJSON()),
			satScore: this.satScore,
			actScore: this.actScore,
			publicUpload: this.publicUpload
		};
	}

	loadJSON(json: any) {
		this.colleges = json.colleges?.map((x: object) => College.fromJSON(x)) ?? this.colleges;
		this.satScore = json.satScore ?? this.satScore;
		this.actScore = json.actScore ?? this.actScore;
		this.publicUpload = json.publicUpload ?? this.publicUpload;
	}

	static fromJSON(json: any): UserData {
		const ret = new UserData();
		ret.loadJSON(json);
		return ret;
	}

	toString(): string {
		return JSON.stringify(this.toJSON());
	}
}

const mainUserData = $state(new UserData());

class UserDataManager {
	data: Map<string, UserData> = new Map();

	async get(id: string): Promise<UserData | null> {
		if (this.data.has(id)) return this.data.get(id)!;
		const newData = await firebaseManager.fetchUserData(id);
		if (newData == null) return null;
		this.data.set(id, newData);
		return newData;
	}
}

export const userDataManager = new UserDataManager();
export default mainUserData;
