// Example 1: Cancel a timer with AbortController.
function waitWithCancel(signal: AbortSignal): Promise<string> {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(new Error("The first wait was cancelled."));
            return;
        }

        const timer = setTimeout(() => resolve("The first wait finished."), 200);

        signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(new Error("The first wait was cancelled."));
        });
    });
}

const firstController = new AbortController();
firstController.abort();
waitWithCancel(firstController.signal).catch((error: Error) => {
    console.log(error.message);
});

// Example 2: Let a timer finish when it is not cancelled.
function waitNormally(): Promise<string> {
    return new Promise((resolve) => {
        const timer = setTimeout(() => resolve("The second wait finished."), 100);
        clearTimeout(timer);
        setTimeout(() => resolve("The second wait finished after a new timer."), 100);
    });
}

waitNormally().then((message: string) => console.log(message));
