// Example 1: Loop through an array of names.
const names: string[] = ["Ana", "Luis", "Sofia"];

for (const name of names) {
    console.log(`Student: ${name}`);
}

// Example 2: Add numbers from an array.
const numbers: number[] = [2, 4, 6];
let total: number = 0;

for (const number of numbers) {
    total += number;
}

console.log(`Total: ${total}`);
