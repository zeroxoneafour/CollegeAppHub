<script lang="ts">
	import { goto } from "$app/navigation";
	import firebaseManager from "$lib/firebase.svelte";

	let email = $state("");
	let password = $state("");

	function logIn() {
		firebaseManager.logIn(email, password).then((x) => {
			if (x) {
				goto("/");
			} else {
				password = "";
			}
		});
	}

	function signUp() {
		firebaseManager.signUp(email, password).then((x) => {
			if (x) {
				goto("/");
			}
		});
	}
</script>

<div class="flex size-full items-center justify-center">
	<div class="card shadow-sm card-xl">
		<div class="card-body items-center gap-5">
			<h2 class="card-title">Login</h2>
			<div>
				<p class="w-full">Email</p>
				<input class="input" type="email" bind:value={email} />
				<p class="w-full">Password</p>
				<input class="input" type="password" bind:value={password} />
			</div>
			<div class="card-actions justify-end">
				<button class="btn btn-primary" onclick={signUp}>Sign Up</button>
				<button class="btn btn-primary" onclick={logIn}>Log In</button>
			</div>
		</div>
	</div>
</div>
