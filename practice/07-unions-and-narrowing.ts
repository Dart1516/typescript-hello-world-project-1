// Example 1: Accept a string or an array of strings.
function showWords(value: string | string[]): void {
    if (typeof value === "string") {
        console.log(`One word: ${value}`);
    } else {
        console.log(`Many words: ${value.join(", ")}`);
    }
}

showWords("hello");
showWords(["hello", "world"]);

// Example 2: Check a value before using it.
function showId(id: string | number): void {
    if (typeof id === "number") {
        console.log(`Number id: ${id}`);
    } else {
        console.log(`Text id: ${id.toUpperCase()}`);
    }
}

showId(15);
showId("student-15");
