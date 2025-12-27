<!--
 Copyright (c) 2025 Simon-Weij
 
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script lang="ts">
	import axios from 'axios';

	let file: File | null = null;
	let password = '';
	let message = '';

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			file = target.files[0];
		}
	}

	async function handleSubmit() {
		if (!file) {
			message = 'Please select a file';
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('password', password);

		try {
			const response = await axios.post('/api/files', formData);
			message = 'Upload successful: ' + JSON.stringify(response.data);
		} catch (error) {
			message = 'Upload failed: ' + error;
		}
	}
</script>

<main class="p-8">
	<form on:submit|preventDefault={handleSubmit} class="max-w-md space-y-4">
		<div>
			<label class="block">
				<span class="text-sm font-medium">File:</span>
				<input
					type="file"
					on:change={handleFileChange}
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
				/>
			</label>
		</div>
		<div>
			<label class="block">
				<span class="text-sm font-medium">Password: (optional)</span>
				<input
					type="password"
					bind:value={password}
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
				/>
			</label>
		</div>
		<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>Upload</button
		>
	</form>
	{#if message}
		<p class="mt-4 rounded bg-gray-100 p-3">{message}</p>
	{/if}
</main>
