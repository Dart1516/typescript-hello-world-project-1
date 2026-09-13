// Example 1: Wait for a small promise.
function waitForMessage(message: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(message), 100);
    });
}

async function showFirstMessage(): Promise<void> {
    const message = await waitForMessage("The first message is ready.");
    console.log(message);
}

// Example 2: Run another async function.
async function showSecondMessage(): Promise<void> {
    const message = await waitForMessage("The second message is ready.");
    console.log(message);
}

async function main(): Promise<void> {
    await showFirstMessage();
    await showSecondMessage();
}

main();
