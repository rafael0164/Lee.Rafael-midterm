
<script lang="ts">

    import MarkdownIt from "markdown-it";

    let response = ""; 
    let userQuery = ""; 
    const md = MarkdownIt();

    
    async function sendQuery() {
        if (!userQuery.trim()) return; 

        try {
            const request = await fetch("http://localhost:5173/api2/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: userQuery }),
            });

            const apiResponse = await request.json();
            response = apiResponse?.message || "No response from AI.";
        } catch (error) {
            console.error("Error sending query:", error);
            response = "Failed to fetch AI response.";
        }
    }
</script>


<div class="flex flex-col items-center pt-15">
	<div class="w-1/2 h-1/2 p-8 border border-gray-300 rounded space-y-6 bg-white shadow">

		
		<div class="text-center text-xl font-bold text-gray-800">
			Chad Bot AI
		</div>

		<div class="p-3 bg-gray-100 rounded overflow-auto">
			<div class="text-left text-gray-700 space-y-2 break-words text-sm/6">
				AI: {@html md.render(response)}
			</div>
		</div>

		<div class="flex items-center space-x-3">
			<input
				type="text"
				bind:value={userQuery}
				placeholder="Ask something..."
				class="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "/>
			<button
				on:click={sendQuery}
				class="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
				Send
			</button>
		</div>

	</div>
</div>