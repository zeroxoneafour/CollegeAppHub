interface Value {
	Value: string;
}

// day is 1-31
// month is 1-11
interface DueDate {
	Day: number;
	Month: number;
}

interface RawApplicationRound {
	Name: string;
	Type: string;
	DueDate: DueDate;
	Binding: boolean;
}

interface RawSupplementalRequirements {
	EssayOrStatement: Value;
	Resume: Value;
	Portfolio: Value;
	Interview: Value;
	AuditionOrPortfolioReview: Value;
}

interface RawCollegeInfo {
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
		SupplementalRequirements: RawSupplementalRequirements;
	};
	ApplicationRounds: { Name: string; Type: string; DueDate: DueDate; Binding: boolean }[];
}

// if date month < this and current month > this, set to next year (for school year)
// 7 == july
export const dueDateCutoff = 7;

function dueDateToDate(dueDate: DueDate): Date {
	let date = new Date();
	let targetYear = date.getFullYear();
	// 1-indexed months
	let currentMonth = date.getMonth() + 1;
	if (dueDate.Month < dueDateCutoff && currentMonth > dueDateCutoff) {
		targetYear += 1;
	} else if (dueDate.Month > dueDateCutoff && currentMonth < dueDateCutoff) {
		targetYear -= 1;
	}
	date.setFullYear(targetYear, dueDate.Month - 1, dueDate.Day);
	return date;
}

export class ApplicationRound {
	name: string;
	type: string;
	dueDate: Date;
	binding: boolean;
	constructor(round: RawApplicationRound) {
		this.name = round.Name;
		this.type = round.Type;
		this.dueDate = dueDateToDate(round.DueDate);
		this.binding = round.Binding;
	}
}

export enum SupplementalRequired {
	NotSpecified,
	NotRequired,
	Conditional,
	Optional,
	Required
}

export class SupplementalRequirements {
	essay: SupplementalRequired = SupplementalRequired.NotSpecified;
	resume: SupplementalRequired = SupplementalRequired.NotSpecified;
	portfolio: SupplementalRequired = SupplementalRequired.NotSpecified;
	interview: SupplementalRequired = SupplementalRequired.NotSpecified;
	audition: SupplementalRequired = SupplementalRequired.NotSpecified;

	private static isSupplementalRequired(supplemental: Value): SupplementalRequired {
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

	constructor(reqs?: RawSupplementalRequirements) {
		if (!reqs) return;
		this.essay = SupplementalRequirements.isSupplementalRequired(reqs.EssayOrStatement);
		this.resume = SupplementalRequirements.isSupplementalRequired(reqs.Resume);
		this.portfolio = SupplementalRequirements.isSupplementalRequired(reqs.Portfolio);
		this.interview = SupplementalRequirements.isSupplementalRequired(reqs.Interview);
		this.audition = SupplementalRequirements.isSupplementalRequired(reqs.AuditionOrPortfolioReview);
	}
}

export class CollegeInfo {
	collegeId: number | null = null;

	name: string = $state("");
	url: string | null = $state(null);

	actScore: [number, number, number] | null = $state(null);
	satScore: [number, number, number] | null = $state(null);
	acceptanceRate: number | null = $state(null);

	applicationRounds: ApplicationRound[] = $state([]);
	requiredSupplementals: SupplementalRequirements = $state(new SupplementalRequirements());

	constructor(collegeId?: number) {
		if (collegeId == undefined) return;
		this.setCollegeId(collegeId);
	}

	setCollegeId(id: number) {
		this.collegeId = id;
		collegeInfoManager.getCollegeInfo(id).then((info) => this.setFromRawCollegeInfo(info));
	}

	private setFromRawCollegeInfo(info: RawCollegeInfo) {
		this.name = info.Name;
		this.url = info.WwwUrl;

		if (info.CalculatedFields.ACTAvg != 0) {
			this.actScore = [
				info.CalculatedFields.ACTMin,
				info.CalculatedFields.ACTAvg,
				info.CalculatedFields.ACTMax
			];
		}
		if (info.CalculatedFields.SATAvg != 0) {
			this.satScore = [
				info.CalculatedFields.SATMin,
				info.CalculatedFields.SATAvg,
				info.CalculatedFields.SATMax
			];
		}
		if (info.CalculatedFields.AcceptanceRate > 0) {
			this.acceptanceRate = info.CalculatedFields.AcceptanceRate;
		}

		this.applicationRounds = info.ApplicationRounds.map((x) => new ApplicationRound(x));
		this.requiredSupplementals = new SupplementalRequirements(
			info.ApplicationDetails.SupplementalRequirements
		);
	}

	static fromJSON(json: any): CollegeInfo {
		const ret = new CollegeInfo(json.collegeId);

		ret.name = json.name ?? null;
		ret.url = json.url ?? null;

		ret.actScore = json.actScore ?? null;
		ret.satScore = json.satScore ?? null;
		ret.acceptanceRate = json.acceptanceRate ?? null;

		ret.applicationRounds = json.applicationRounds ?? [];
		ret.requiredSupplementals = json.requiredSupplementals ?? null;

		return ret;
	}

	toJSON(): object {
		if (this.collegeId != null) {
			return { collegeId: this.collegeId };
		}
		return {
			name: this.name,
			url: this.url,

			actScore: this.actScore,
			satScore: this.satScore,
			acceptanceRate: this.acceptanceRate,

			applicationRounds: this.applicationRounds,
			requiredSupplementals: this.requiredSupplementals
		};
	}
}

export interface CollegeIdPair {
	name: string;
	id: number;
}

class CollegeInfoManager {
	collegeSearchNames: CollegeIdPair[] = [];
	collegeAbbreviations: CollegeIdPair[] = [];
	collegeRealNames: Map<number, string> = new Map();

	collegeInfo: Map<number, RawCollegeInfo> = new Map();

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

	async getCollegeInfo(id: number): Promise<RawCollegeInfo> {
		if (this.collegeInfo.has(id)) return this.collegeInfo.get(id)!;
		let res = await fetch("/colleges/" + id + ".json");
		let collegeInfo = (await res.json()) as RawCollegeInfo;
		this.collegeInfo.set(id, collegeInfo);
		return collegeInfo;
	}
}

export let collegeInfoManager: CollegeInfoManager = new CollegeInfoManager();
