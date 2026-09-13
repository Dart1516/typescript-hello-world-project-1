// Example 1: Throw an error when a number is not valid.
function checkAge(age: number): void {
    if (age < 18) {
        throw new Error("The student is under 18.");
    }

    console.log("The student is 18 or older.");
}

try {
    checkAge(20);
} catch (error) {
    console.log((error as Error).message);
}

// Example 2: Catch an error from a word check.
function checkWord(word: string): void {
    if (word.trim() === "") {
        throw new Error("The word cannot be empty.");
    }

    console.log(`The word is: ${word}`);
}

try {
    checkWord("");
} catch (error) {
    console.log((error as Error).message);
}
