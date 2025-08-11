export enum ApplicationStatus {
	Pending,
	Accepted,
	Rejected,
	Deferred
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

export class College {
	collegeId: number;
	status: ApplicationStatus = $state(ApplicationStatus.Pending);
	supplementals: Supplemental[] = $state([]);
	collegeInfo: CollegeInfo | null = $state(null);

	constructor(collegeId: number) {
		this.collegeId = collegeId;
		collegeInfoManager.getCollegeInfo(collegeId).then((info) => (this.collegeInfo = info));
	}

	static fromJSON(json: any): College {
		const college = new College(json.collegeId);
		college.status = json.status;
		for (const sup of json.supplementals) {
			college.supplementals.push(new Supplemental(sup.name, sup.type, sup.link));
		}
		return college;
	}

	toJSON(): object {
		return {
			collegeId: this.collegeId,
			status: this.status
		};
	}
}

export interface CollegeIdPair {
	name: string;
	id: number;
}

export interface Value {
	Value: string;
}

export interface DueDate {
	Day: number;
	Month: number;
}

export interface CollegeInfo {
	Scid: number;
	Name: string;
	Address: string;
	City: string;
	State: string;
	Zip: string;
	WwwUrl: string;
	Opeid: string;
	Opeid6: string;
	Iped: string;
	Setting: string;
	Location: {
		type: string;
		coordinates: number[];
	};
	Country: string;
	ScoirApplyEnabled: boolean;
	DisplayAsScoirApply: boolean;
	CoalitionMember: boolean;
	GeneralInfo: {
		AdmPhone: string;
		AdmEmail: string;
		AdmFax: string;
		FinPhone: string;
		FtDegree3: number;
		HasOnCampusHousing: boolean;
		HBCU: boolean;
		HonorsCollege: string;
		OthRelig: string;
		PublicPrivate: string;
		ResidenceCollege: boolean;
		TotalDegree3: number;
		UnivType: string;
		SchoolClassifier: string;
	};
	FreshEnroll: {
		NumApplEnrolled: number;
		NumApplOffered: number;
		NumApplReceived: number;
	};
	TuitionAndExpenses: {
		FeesIndistrict: number;
		FeesInstate: number;
		FeesOutstate: number;
		TuitionIndistrict: number;
		TuitionInstate: number;
		TuitionOutstate: number;
		RoomBoard: number;
		BookFees: number;
		StickerInState: number;
		StickerOutState: number;
	};
	AdmissionFreshmen: {
		ApplicFeeAmt: number;
	};
	Admissions: {
		CommonForm: string;
		CoalitionForm: boolean;
		CommonGroup: string;
	};
	FinancialAid: {
		AverageDebt: number;
		DebtBalanceMedian: number;
		PcFedLoansReceived: number;
		PcFinAidReceived: number;
	};
	NetPrice: {
		NetAverage: number;
		Income1: number;
		Income2: number;
		Income3: number;
		Income4: number;
		Income5: number;
	};
	CalculatedFields: {
		AcceptanceRate: number;
		SATMin: number;
		SATMax: number;
		SATAvg: number;
		ACTAvg: number;
		ACTMin: number;
		ACTMax: number;
	};
	Sports: {};
	Degrees: any;
	ApplicationDetails: {
		StandardizedTests: {
			SATorACT: Value;
			WithWriting: Value;
			SubjectTests: Value;
		};
		SupplementalRequirements: {
			EssayOrStatement: Value;
			Resume: Value;
			Portfolio: Value;
			Interview: Value;
			AuditionOrPortfolioReview: Value;
		};
	};
	ApplicationRounds: { Name: string; Type: string; DueDate: DueDate; Binding: boolean }[];
}

export enum SupplementalRequired {
	NotSpecified,
	NotRequired,
	Conditional,
	Optional,
	Required
}

export function isSupplementalRequired(supplemental: Value): SupplementalRequired {
	switch (supplemental.Value) {
		case "NotSpecified":
			return SupplementalRequired.NotSpecified;
		case "NotRequired":
			return SupplementalRequired.NotRequired;
		case "Conditional":
			return SupplementalRequired.Conditional;
		case "Optional":
			return SupplementalRequired.Optional;
		case "Required":
			return SupplementalRequired.Required;
		default:
			return SupplementalRequired.NotSpecified;
	}
}

class CollegeInfoManager {
	collegeSearchNames: CollegeIdPair[] = [];
	collegeAbbreviations: CollegeIdPair[] = [];
	collegeRealNames: Map<number, string> = new Map();

	collegeInfo: Map<number, CollegeInfo> = new Map();

	initialize(collegeList: object) {
		for (const [collegeName, collegeId] of Object.entries(collegeList)) {
			// only alphanumeric lowercase, convert dashes to spaces
			let lowercase = collegeName.split("-").join(" ");
			lowercase = collegeName.toLocaleLowerCase().replace(/[^a-z0-9 ]/gi, "");
			this.collegeSearchNames.push({ name: lowercase, id: collegeId });
			let filterWords = ["of", "in", "the", "at"];
			let abbreviation = lowercase
				.split(" ")
				.filter((x) => !filterWords.includes(x))
				.reduce((acc, x) => acc + x.charAt(0), "");
			this.collegeAbbreviations.push({ name: abbreviation, id: collegeId });
			this.collegeRealNames.set(collegeId, collegeName);
		}
	}

	getCollegeIdPairs(query: string) {
		// exact matches
		let matches = this.collegeSearchNames.filter((x) => x.name.startsWith(query));
		if (matches.length >= 5) return matches.slice(0, 5);
		// abbreviation matches
		matches.push(
			...this.collegeAbbreviations
				.filter((x) => x.name.startsWith(query))
				.filter((x) => !matches.some((m) => m.id === x.id))
		);
		if (matches.length >= 5) return matches.slice(0, 5);
		// u shortcut
		if (query.charAt(0) === "u") {
			matches.push(
				...this.collegeSearchNames
					.filter((x) => x.name.startsWith("university of " + query.slice(1)))
					.filter((x) => !matches.some((m) => m.id === x.id))
			);
		}
		// includes
		matches.push(
			...this.collegeSearchNames
				.filter((x) => x.name.includes(query))
				.filter((x) => !matches.some((m) => m.id === x.id))
		);
		return matches.slice(0, 5);
	}

	async getCollegeInfo(id: number): Promise<CollegeInfo> {
		if (this.collegeInfo.has(id)) return this.collegeInfo.get(id)!;
		let res = await fetch("/colleges/" + id + ".json");
		let collegeInfo = (await res.json()) as CollegeInfo;
		this.collegeInfo.set(id, collegeInfo);
		return collegeInfo;
	}
}

export let collegeInfoManager: CollegeInfoManager = new CollegeInfoManager();
