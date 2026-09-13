// Example 1: Describe an object with an interface.
interface Book {
    title: string;
    pages: number;
}

const firstBook: Book = {
    title: "The Little Prince",
    pages: 96
};
console.log(firstBook.title, firstBook.pages);

// Example 2: Use another object with the same interface.
const secondBook: Book = {
    title: "A Simple Story",
    pages: 80
};
console.log(secondBook.title, secondBook.pages);
