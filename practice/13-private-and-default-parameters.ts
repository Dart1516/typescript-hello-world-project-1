// Example 1: A private list can only be changed by the class.
class WordList {
    private words: string[] = [];

    add(word: string): void {
        this.words.push(word.toLowerCase());
    }

    has(word: string): boolean {
        return this.words.includes(word.toLowerCase());
    }
}

const firstList = new WordList();
firstList.add("TypeScript");
console.log(firstList.has("typescript"));

// Example 2: A default parameter gives a value when no limit is sent.
function showFirstWords(words: string[], limit: number = 2): string[] {
    return words.slice(0, limit);
}

console.log(showFirstWords(["one", "two", "three"]));
console.log(showFirstWords(["one", "two", "three"], 1));
