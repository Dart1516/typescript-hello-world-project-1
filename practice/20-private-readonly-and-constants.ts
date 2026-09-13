// Example 1: private protects data and readonly prevents reassignment.
class VocabularySettings {
    private readonly language: string = "English";
    private maximumWords: number;

    constructor(maximumWords: number) {
        this.maximumWords = maximumWords;
    }

    showSettings(): void {
        console.log(`Language: ${this.language}`);
        console.log(`Maximum words: ${this.maximumWords}`);
    }

    changeMaximumWords(newMaximumWords: number): void {
        this.maximumWords = newMaximumWords;
    }
}

const firstSettings = new VocabularySettings(2);
firstSettings.showSettings();
firstSettings.changeMaximumWords(3);
firstSettings.showSettings();

// Example 2: readonly allows reading a value but not assigning a new value.
interface WordSettings {
    readonly word: string;
    category: string;
}

const firstWordSettings: WordSettings = {
    word: "tree",
    category: "noun"
};

console.log(firstWordSettings.word);
firstWordSettings.category = "English noun";
console.log(firstWordSettings.category);
