<script lang="ts">
	import MarkdownIt from 'markdown-it';

	let userQuery = '';
	let chatHistory: { sender: 'user' | 'ai'; message: string }[] = [];
	const md = MarkdownIt();

	async function sendQuery() {
		if (!userQuery.trim()) return;

		chatHistory = [...chatHistory, { sender: 'user', message: userQuery }];

		try {
			const request = await fetch('http://localhost:5173/api2/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ query: userQuery })
			});

			const apiResponse = await request.json();
			const aiResponse = apiResponse?.message || 'No response from AI.';

			chatHistory = [...chatHistory, { sender: 'ai', message: aiResponse }];
		} catch (error) {
			console.error('Error sending query:', error);
			chatHistory = [...chatHistory, { sender: 'ai', message: 'Failed to fetch AI response.' }];
		} finally {
			userQuery = '';
		}
	}
</script>

<div class="pt-30 100 flex flex-col items-center">
	<div class="h-1/2 w-1/2 space-y-6 rounded border border-gray-300 bg-sky-100 p-8">
		<div class="text-center text-xl font-bold text-gray-800">Ai</div>

		<div class="h-64 overflow-auto rounded bg-neutral-50 p-3">
			<div class="space-y-2 break-words text-left text-sm/6 text-gray-700">
				{#each chatHistory as chat}
					<div class="mb-2">
						<strong class={chat.sender === 'user' ? 'text-blue-500' : 'text-green-500'}>
							{chat.sender === 'user' ? 'You' : 'AI'}:
						</strong>
						<span>{@html md.render(chat.message)}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="flex items-center space-x-3">
			<input
				type="text"
				bind:value={userQuery}
				placeholder="Ask something..."
				class="flex-1 rounded border border-gray-300 bg-neutral-50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				on:click={sendQuery}
				class="rounded bg-blue-500 p-3 text-white transition hover:bg-blue-600"
			>
				Send
			</button>
		</div>
	</div>
</div>
