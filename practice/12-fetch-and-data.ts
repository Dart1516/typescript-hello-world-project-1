interface ApiWord {
    word: string;
    defs?: string[];
}

// Example 1: Read one word from an API.
async function getWord(word: string): Promise<void> {
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=d&max=1`;
    const response = await fetch(url);

    // ok is false when the server returns an HTTP error status.
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    // json() converts the server response into JavaScript data.
    const data = (await response.json()) as ApiWord[];
    const result = data[0];
    console.log(result?.word ?? "No word found");
}

// Example 2: Handle an API error with try and catch.
async function tryWord(word: string): Promise<void> {
    try {
        await getWord(word);
        console.log("The API request finished.");
    } catch (error) {
        console.log(`Request error: ${(error as Error).message}`);
    }
}

tryWord("hello");
