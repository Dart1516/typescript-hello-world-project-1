// Example 1: Check a successful HTTP response before reading its data.
async function readSuccessfulResponse(): Promise<void> {
    const response = await fetch("https://api.datamuse.com/words?sp=hello&max=1");

    if (!response.ok) {
        console.log(`Request failed with status ${response.status}.`);
        return;
    }

    const responseData: unknown = await response.json();
    console.log("The response was successful:", responseData);
}

// Example 2: Use try and catch when a request can fail.
async function readResponseWithErrorHandling(): Promise<void> {
    try {
        const response = await fetch("https://api.datamuse.com/words?sp=typescript&max=1");

        if (!response.ok) {
            throw new Error(`Server status: ${response.status}`);
        }

        const responseData: unknown = await response.json();
        console.log("The second response was read:", responseData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown request error.";
        console.log(`Could not read the response: ${errorMessage}`);
    }
}

readSuccessfulResponse();
readResponseWithErrorHandling();