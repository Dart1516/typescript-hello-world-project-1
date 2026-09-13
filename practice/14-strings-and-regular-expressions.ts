// Example 1: Clean a sentence and find words with a regular expression.
const sentence: string = " Hello, TypeScript student! ";
const cleanSentence: string = sentence.trim().toLowerCase();
const words: string[] = cleanSentence.match(/[a-z]+/g) ?? [];
console.log(words);

// Example 2: Replace a prefix and split text into parts.
const rawDefinition: string = "n\tA small example.";
const cleanDefinition: string = rawDefinition.replace(/^[a-z]+\t/, "").trim();
const parts: string[] = cleanDefinition.split(" ");
console.log(cleanDefinition);
console.log(parts.join(" | "));
