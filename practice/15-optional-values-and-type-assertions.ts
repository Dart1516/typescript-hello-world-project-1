interface StudentResult {
    name: string;
    comment?: string;
}

// Example 1: An optional property may not exist.
const firstResult: StudentResult = { name: "Ana" };
console.log(firstResult.comment ?? "No comment");

// Example 2: Use a type assertion after reading unknown data.
const unknownValue: unknown = "hello";
const textValue = unknownValue as string;
console.log(textValue.toUpperCase());

const secondResult: StudentResult = { name: "Luis", comment: "Good work" };
console.log(secondResult.comment?.toUpperCase() ?? "No comment");
