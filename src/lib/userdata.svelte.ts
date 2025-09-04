import { College } from "./colleges.svelte";
import firebaseManager from "./firebase.svelte";

export enum SortOrder {
	Custom,
	DueDate,
	Alphabetical
}
export class UserData {
	colleges: College[] = $state([]);
	satScore: number = $state(1300);
	actScore: number = $state(28);
	publicUpload: boolean = $state(false);
	collegeSortOrder: SortOrder = $state(SortOrder.Custom);
	// no state because this is updated whenever the rest of the state changes
	lastModifiedTime: number = 0;

	toJSON(): object {
		return {
			colleges: this.colleges.map((x) => x.toJSON()),
			satScore: this.satScore,
			actScore: this.actScore,
			publicUpload: this.publicUpload,
			collegeSortOrder: this.collegeSortOrder,
			lastModifiedTime: this.lastModifiedTime
		};
	}

	loadJSON(json: any) {
		this.colleges = json.colleges?.map((x: object) => College.fromJSON(x)) ?? [];
		this.satScore = json.satScore ?? 1300;
		this.actScore = json.actScore ?? 28;
		this.publicUpload = json.publicUpload ?? false;
		this.collegeSortOrder = json.collegeSortOrder ?? SortOrder.Custom;
		this.lastModifiedTime = json.lastModifiedTime ?? 0;
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
