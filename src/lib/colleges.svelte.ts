import { CollegeInfo } from "./collegeinfo.svelte";

export enum ApplicationStatus {
	Pending,
	Accepted,
	Rejected,
	Deferred,
	Committed
}

export enum SupplementalType {
	Essay,
	Resume,
	Portfolio
}

export class Supplemental {
	name: string;
	type: SupplementalType;
	link: string;

	constructor(name: string, type: SupplementalType, link: string) {
		this.name = $state(name);
		this.type = $state(type);
		this.link = $state(link);
	}

	toJSON(): object {
		return {
			name: this.name,
			type: this.type,
			link: this.link
		};
	}
}

export class NamedDate {
	name: string = $state("");
	date: Date = $state(new Date());

	constructor(name: string, date: Date | string) {
		this.name = name;
		this.date = new Date(date);
	}

	toJSON(): object {
		return {
			name: this.name,
			date: this.date
		};
	}
}

export class College {
	collegeInfo: CollegeInfo = $state(new CollegeInfo());

	status: ApplicationStatus = $state(ApplicationStatus.Pending);
	supplementals: Supplemental[] = $state([]);
	applicationLink: string = $state("");
	dueDate: Date = $state(new Date());
	dates: NamedDate[] = $state([]);

	constructor(collegeInfo: CollegeInfo) {
		this.collegeInfo = collegeInfo;
	}

	static fromJSON(json: any): College {
		const college = new College(CollegeInfo.fromJSON(json.collegeInfo));
		college.status = json.status ?? ApplicationStatus.Pending;
		college.supplementals =
			json.supplementals?.map((x: any) => new Supplemental(x.name, x.type, x.link)) ?? [];
		college.applicationLink = json.applicationLink ?? "";
		college.dueDate = new Date(json.dueDate) ?? new Date();
		college.dates = json.dates?.map((x: any) => new NamedDate(x.name, x.date)) ?? [];
		return college;
	}

	toJSON(): object {
		return {
			collegeInfo: this.collegeInfo.toJSON(),
			status: this.status,
			supplementals: this.supplementals.map((x) => x.toJSON()),
			applicationLink: this.applicationLink,
			dueDate: this.dueDate.toJSON(),
			dates: this.dates.map((x) => x.toJSON())
		};
	}
}
