// Example 1: map creates a new list from every item in another list.
const wordsToUppercase: string[] = ["tree", "book", "water"];
const uppercaseWords: string[] = wordsToUppercase.map((word: string): string => {
    return word.toUpperCase();
});

console.log(uppercaseWords);

// Example 2: Promise.all waits for several asynchronous tasks together.
function getDefinitionLater(word: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Definition for ${word}`);
        }, 100);
    });
}

async function getSeveralDefinitions(): Promise<void> {
    const wordsToSearch: string[] = ["tree", "book"];

    // map creates one promise for each word.
    const definitionPromises: Promise<string>[] = wordsToSearch.map(
        (word: string): Promise<string> => getDefinitionLater(word)
    );

    // Promise.all waits for all promises before continuing.
    const definitions: string[] = await Promise.all(definitionPromises);
    console.log(definitions);
}

getSeveralDefinitions();
