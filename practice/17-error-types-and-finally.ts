// Example 1: Check the type of an error before using its message.
function openFile(fileName: string): void {
    if (fileName === "missing.txt") {
        throw new Error("The file was not found.");
    }

    console.log(`Opened: ${fileName}`);
}

try {
    openFile("missing.txt");
} catch (error) {
    if (error instanceof Error) {
        console.warn(`Warning: ${error.message}`);
    }
} finally {
    console.log("The first file operation finished.");
}

// Example 2: Use console.error for a serious problem.
function divide(firstNumber: number, secondNumber: number): number {
    if (secondNumber === 0) {
        throw new Error("Division by zero is not allowed.");
    }

    return firstNumber / secondNumber;
}

try {
    console.log(divide(10, 2));
    console.log(divide(10, 0));
} catch (error) {
    console.error(`Error: ${(error as Error).message}`);
}
