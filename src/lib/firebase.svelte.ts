import { initializeApp, type FirebaseApp } from "firebase/app";

import {
	getAuth,
	createUserWithEmailAndPassword,
	type Auth,
	type UserCredential,
	signInWithEmailAndPassword,
	type User
} from "firebase/auth";

import {
	Database,
	getDatabase,
	get as dbGet,
	set as dbSet,
	child,
	ref,
	remove
} from "firebase/database";

import { initializeAnalytics, type Analytics } from "firebase/analytics";
import mainUserData from "./userdata.svelte";

class FirebaseManager {
	app: FirebaseApp;
	analytics: Analytics;
	auth: Auth;
	database: Database;

	user: User | null = $state(null);
	errorMsg: string = $state("");

	constructor() {
		const firebaseConfig = {
			apiKey: "AIzaSyAnxHz7fyBZ57V2s2d2Jc1o7SmFo6M0New",
			authDomain: "collegeapphub.firebaseapp.com",
			databaseURL: "https://collegeapphub-default-rtdb.firebaseio.com",
			projectId: "collegeapphub",
			storageBucket: "collegeapphub.firebasestorage.app",
			messagingSenderId: "936120726081",
			appId: "1:936120726081:web:77bccaad8e017698268cc0",
			measurementId: "G-X49X4PD6DL"
		};
		this.app = initializeApp(firebaseConfig);
		this.analytics = initializeAnalytics(this.app);
		this.auth = getAuth(this.app);
		this.database = getDatabase(this.app);
	}

	async logInOrSignUp(email: string, password: string) {
		let cred: UserCredential | undefined = undefined;
		try {
			cred = await signInWithEmailAndPassword(this.auth, email, password);
		} catch (err: any) {
			if (err.code == "auth/user-not-found") {
				cred = await createUserWithEmailAndPassword(this.auth, email, password);
			}
		}
		if (cred != undefined) this.user = cred.user;
	}

	async loadMainUserData() {
		if (this.user == null) return null;
		const publicUpload = mainUserData.publicUpload;

		const dbPath = (publicUpload ? "public_data/" : "private_data/") + this.user.uid;
		const snapshot = await dbGet(child(ref(this.database), dbPath));
		if (snapshot.exists()) {
			mainUserData.loadJSON(snapshot.val());
		}
	}

	async saveMainUserData() {
		if (this.user == null) return;
		const publicUpload = mainUserData.publicUpload;

		const dbPath = (publicUpload ? "public_data/" : "private_data/") + this.user.uid;
		await dbSet(ref(this.database, dbPath), mainUserData.toJSON());

		// remove old data in case switching from public to private or vice versa
		const otherDbPath = (publicUpload ? "private_data/" : "public_data/") + this.user.uid;
		remove(ref(this.database, otherDbPath));
	}
}

const firebaseManager = $state(new FirebaseManager());
export default firebaseManager;
