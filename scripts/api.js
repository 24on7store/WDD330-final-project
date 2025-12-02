// api.js
export async function getWordDefinition(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        return await response.json();
    } catch (error) {
        console.error("API error:", error);
    }
}
