import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
    const { query } = await request.json(); 

    const ollama = new Ollama({ host: "http://localhost:11434/" });

    const dataOfMasterUser = {
        name: "Rafael Christian",
        course: "BSCS",
        hobbies: ["basketball", "playing valorant", "playing mobile legends"],
        favoriteFood: ["pansit", "sinigang", "bicol express"],
        userType: "Master User",
    };

    const systemMessage = query.toLowerCase().includes("master user")
        ? `Here is the information of the master user: ${JSON.stringify(dataOfMasterUser)}`
        : "Respond only based on the information provided in the query.";

    const chat = await ollama.chat({
        model: "deepseek-r1:1.5b",
        messages: [
            {
                role: "system",
                content: systemMessage,
            },
            {
                role: "user",
                content: query,
            },
        ],
    });

    return json({ message: chat.message.content });
};
