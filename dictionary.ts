// ============================================================================
// 00. CONSOLE BASICS: stdin AND stdout
// ============================================================================

// Node.js gives a terminal two important communication channels:
// - stdin means "standard input": data typed by the user.
// - stdout means "standard output": text printed to the terminal.
//
// TypeScript normally learns these types from the @types/node package.
// This project does not install that package, so we describe only the
// small parts of stdin and stdout that this program needs.
interface TerminalInput {
    // Tell Node.js to give us text instead of raw bytes.
    setEncoding(encoding: string): void;

    // Listen for data typed by the user.
    on(event: "data", listener: (textTypedByUser: string) => void): this;

    // Stop listening after the first answer is received.
    removeListener(event: "data", listener: (textTypedByUser: string) => void): this;
}

interface TerminalOutput {
    // Write text to the terminal without automatically adding a new line.
    write(text: string): boolean;
}

interface NodeTerminalProcess {
    // stdin is the keyboard input stream.
    stdin: TerminalInput;

    // stdout is the terminal output stream.
    stdout: TerminalOutput;
}

interface TerminalQuestionTool {
    // Show a question and wait asynchronously for the user's answer.
    askQuestion(promptText: string): Promise<string>;

    // Finish using the terminal input.
    close(): void;
}

// globalThis is the shared global object available in JavaScript and Node.js.
// Here we tell TypeScript that this global object contains Node's process.
const nodeTerminalProcess = (
    globalThis as typeof globalThis & { process: NodeTerminalProcess }
).process;

// Give the two streams descriptive names so their purpose is easy to see.
const terminalInput = nodeTerminalProcess.stdin;
const terminalOutput = nodeTerminalProcess.stdout;

// Node's readline package would normally provide this question feature.
// This small local version avoids requiring @types/node in this beginner project.
const terminalQuestionTool = {
    createTerminalQuestionTool(
        terminalStreams: { input: TerminalInput; output: TerminalOutput }
    ): TerminalQuestionTool {
        return {
            askQuestion(promptText: string): Promise<string> {
                // stdout displays the question before waiting for input.
                terminalStreams.output.write(promptText);
                terminalStreams.input.setEncoding("utf8");

                return new Promise((resolve) => {
                    // This function runs when the user types an answer.
                    const receiveUserAnswer = (typedText: string): void => {
                        // We need only one answer, so remove the listener now.
                        terminalStreams.input.removeListener("data", receiveUserAnswer);

                        // A terminal answer normally ends with a line break.
                        // Keep only the first line and return it to the caller.
                        const firstLine = typedText.split(/\r?\n/, 1)[0] ?? "";
                        resolve(firstLine);
                    };

                    // "data" is an event: Node calls our function when input arrives.
                    terminalStreams.input.on("data", receiveUserAnswer);
                });
            },
            close(): void {
                // There is no extra resource to close in this small implementation.
                return;
            }
        };
    }
};

// ============================================================================
// 01. TYPES USED BY THE DICTIONARY
// ============================================================================

/**
 * Interface representing the structure of a node in the vocabulary tree.
 */
interface WordNode {
    word: string;
    definition: string;
    children: WordNode[];
}

/**
 * Interface representing Datamuse API raw item response.
 */
interface DatamuseEntry {
    word: string;
    defs?: string[];
}

// ============================================================================
// 02. CLASS: DictionaryClient
// ============================================================================

/**
 * Handles communication with external dictionary API.
 */
class DictionaryClient {
    // This class has one responsibility: communicate with the dictionary API.
    private readonly apiUrl: string = "https://api.datamuse.com/words";

    /**
     * Fetches the definition of a given word asynchronously.
     * Throws an exception if the word is not found or request fails.
     */
    async fetchDefinition(word: string): Promise<string> {
        const encodedWord = encodeURIComponent(word);
        const requestUrl = `${this.apiUrl}?sp=${encodedWord}&md=d&max=1`;
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 10000);

        try {
            const response = await fetch(requestUrl, { signal: abortController.signal });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const entries = (await response.json()) as DatamuseEntry[];

            const firstEntry = entries[0];
            if (!firstEntry?.defs?.length) {
                throw new Error(`No definition found for "${word}".`);
            }

            // Clean definition string (Datamuse prefixes definitions with "n\t", "v\t", etc.)
            const rawDef = firstEntry.defs[0];
            if (!rawDef) {
                throw new Error(`Definition text is empty for "${word}".`);
            }

            return rawDef.replace(/^[a-z]+\t/, "").trim();
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                throw new Error("DictionaryClient Error: The request timed out after 10 seconds.");
            }

            const errorMessage = error instanceof Error ? error.message : "Unknown API error.";
            throw new Error(`DictionaryClient Error: ${errorMessage}`);
        } finally {
            clearTimeout(timeoutId);
        }
    }
}

// ============================================================================
// 3. CLASS: WordRecorder
// ============================================================================

/**
 * Remembers expanded words and filters common words from definitions.
 */
class WordRecorder {
     // This list grows as the recursive search visits new words.
     private readonly expandedWords: string[] = [];

     // These common words do not add useful meaning to the vocabulary tree.
     private readonly functionWords: string[] = [
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
        "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
        "this", "but", "his", "by", "from", "they", "we", "say", "her",
        "she", "or", "an", "will", "my", "one", "all", "would", "there",
        "their", "what", "so", "up", "out", "if", "about", "who", "get",
        "which", "go", "me", "is", "are", "was", "were", "has", "had"
    ];

    /**
     * Return true when a word was already expanded.
     */
    hasBeenExpanded(word: string): boolean {
        return this.expandedWords.includes(word.toLowerCase());
    }

    /**
    * Save a word in lowercase so comparisons are consistent.
     */
    record(word: string): void {
        this.expandedWords.push(word.toLowerCase());
    }

    /**
     * Find useful words in a definition that can be expanded next.
     */
    extractCandidateWords(definition: string, maximumWords: number = 2): string[] {
        const wordsInDefinition: string[] = definition.toLowerCase().match(/[a-z]{4,}/g) ?? [];
        const candidateWords: string[] = [];

        for (const word of wordsInDefinition) {
            const isCommonWord = this.functionWords.includes(word);
            const wasAlreadyExpanded = this.hasBeenExpanded(word);
            const isAlreadyCandidate = candidateWords.includes(word);

            if (!isCommonWord && !wasAlreadyExpanded && !isAlreadyCandidate) {
                candidateWords.push(word);
            }

            if (candidateWords.length >= maximumWords) {
                break;
            }
        }

        return candidateWords;
    }
}

// ============================================================================
// 4. CLASS: TreePrinter
// ============================================================================

/**
 * Formats and displays the vocabulary tree in the terminal.
 */
class TreePrinter {
    /**
     * Print one node, then print all of its children below it.
     */
    printTree(node: WordNode, prefix: string = "", isLastNode: boolean = true): void {
        const branchSymbol = isLastNode ? "└── " : "├── ";
        const coloredWord = `\x1b[36m${node.word.toUpperCase()}\x1b[0m`;
        console.log(`${prefix}${branchSymbol}${coloredWord}: ${node.definition}`);

        const childPrefix = prefix + (isLastNode ? "    " : "│   ");
        for (let index = 0; index < node.children.length; index++) {
            const childNode = node.children[index];
            if (childNode) {
                const isLastChild = index === node.children.length - 1;
                this.printTree(childNode, childPrefix, isLastChild);
            }
        }
    }
}

// ============================================================================
// 5. RECURSIVE TREE BUILDING
// ============================================================================

/**
 * Explore a word and recursively explore words from its definition.
 * remainingDepth tells the function when it must stop.
 */
async function exploreWord(
    word: string,
    remainingDepth: number,
    dictionaryClient: DictionaryClient,
    wordRecorder: WordRecorder
): Promise<WordNode> {
    // Record this word so it cannot create an infinite cycle.
    wordRecorder.record(word);

    const definition = await dictionaryClient.fetchDefinition(word);

    const wordNode: WordNode = {
        word,
        definition,
        children: []
    };

    // Base case: depth zero means this word should not be expanded.
    if (remainingDepth === 0) {
        return wordNode;
    }

    // Find up to two useful words in the definition.
    const candidateWords = wordRecorder.extractCandidateWords(definition, 2);

    // Start both child requests together instead of waiting for them one by one.
    const childResults = await Promise.all(
        candidateWords.map(async (candidateWord): Promise<WordNode | null> => {
            try {
                return await exploreWord(
                    candidateWord,
                    remainingDepth - 1,
                    dictionaryClient,
                    wordRecorder
                );
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error.";
                console.warn(`\x1b[33m[Skip] Could not expand "${candidateWord}": ${errorMessage}\x1b[0m`);
                return null;
            }
        })
    );

    for (const childResult of childResults) {
        if (childResult) {
            wordNode.children.push(childResult);
        }
    }

    return wordNode;
}

// ============================================================================
// 6. PROGRAM ENTRY POINT
// ============================================================================

/**
 * Run the complete vocabulary learning program.
 */
async function runDictionary(): Promise<void> {
    const terminalQuestionToolInstance = terminalQuestionTool.createTerminalQuestionTool({
        input: terminalInput,
        output: terminalOutput
    });

    console.log("=========================================");
    console.log("  Vocabulary Tree Explorer (TypeScript)  ");
    console.log("=========================================\n");

    try {
        const enteredWord = await terminalQuestionToolInstance.askQuestion(
            "Enter an English word to explore: "
        );
        const cleanedWord = enteredWord.trim().toLowerCase();

        if (!cleanedWord) {
            console.log("Please enter a valid word.");
            return;
        }

        console.log(`\nSearching and expanding "${cleanedWord}"...\n`);

        const dictionaryClient = new DictionaryClient();
        const wordRecorder = new WordRecorder();
        const treePrinter = new TreePrinter();

        // A depth of 1 prints the original word and two related words.
        const vocabularyTree = await exploreWord(
            cleanedWord,
            1,
            dictionaryClient,
            wordRecorder
        );

        console.log("Vocabulary Result Tree:\n");
        treePrinter.printTree(vocabularyTree);
        console.log("\nDone!");
    } catch (error) {
        // Top-level Exception Handling
        const errorMessage = error instanceof Error ? error.message : "Unknown program error.";
        console.error(`\x1b[31mError: ${errorMessage}\x1b[0m`);
    } finally {
        terminalQuestionToolInstance.close();
    }
}

// Execute application
runDictionary();
