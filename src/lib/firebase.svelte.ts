import { initializeApp, type FirebaseApp } from "firebase/app";

import {
	getAuth,
	createUserWithEmailAndPassword,
	type Auth,
	type UserCredential,
	signInWithEmailAndPassword,
	type User
} from "firebase/auth";

import { initializeAnalytics, type Analytics } from "firebase/analytics";

class FirebaseManager {
	app: FirebaseApp;
	analytics: Analytics;
	auth: Auth;
	user: User | null = $state(null);

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
	}

	async logInOrSignUp(email: string, password: string) {
		let cred: UserCredential | undefined = undefined;
		try {
			cred = await createUserWithEmailAndPassword(this.auth, email, password);
		} catch (err: any) {
			if (err.code == "auth/email-already-in-use") {
				cred = await signInWithEmailAndPassword(this.auth, email, password);
			}
		}
		if (cred != undefined) this.user = cred.user;
	}
}

const firebaseManager = $state(new FirebaseManager());
export default firebaseManager;
