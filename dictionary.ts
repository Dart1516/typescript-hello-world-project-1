import * as readline from 'readline';
import { stdin as input, stdout as output } from 'node:process';

// STUDENT NOTE: Setup the readline interface to take user input from terminal (stdin/stdout).
const rl = readline.createInterface({ input, output });

/**
 * STUDENT NOTE: Helper function to convert readline's callback-based prompt into a Promise.
 * This allows us to use modern 'async/await' syntax when asking questions in CLI.
 */
function askQuestion(promptText: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(promptText, (answer: string) => {
            resolve(answer.trim());
        });
    });
}

// STUDENT NOTE: Interface defining our recursive tree structure.
// Each node holds a word, its definition, and an array of child nodes (other words).
interface WordNode {
    word: string;
    definition: string;
    children: WordNode[];
}

// STUDENT NOTE: Type interface mapping the exact JSON structure returned by Datamuse API.
interface DatamuseEntry {
    word: string;
    defs?: string[];
}

/**
 * CLASS 1: DictionaryClient
 * REQUIREMENT: Asynchronous HTTP request handling with API integration and error handling.
 */
class DictionaryClient {
    // API endpoint base URL
    private readonly apiUrl: string = "https://api.datamuse.com/words";

    /**
     * Fetches the definition of a given word asynchronously.
     * Includes timeout cancellation and HTTP error handling.
     */
    async fetchDefinition(word: string): Promise<string> {
        // STUDENT NOTE: encodeURIComponent ensures special characters don't break the web URL.
        const encodedWord = encodeURIComponent(word);
        
        // STUDENT NOTE: Query params:
        // ?sp= -> Spelled like (exact match)
        // &md=d -> Request metadata definitions ('defs' array)
        // &max=1 -> Limit response payload to 1 result
        const requestUrl = `${this.apiUrl}?sp=${encodedWord}&md=d&max=1`;

        // STUDENT NOTE: AbortController prevents hanging requests by cancelling after 10 seconds.
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 10000);

        try {
            const response = await fetch(requestUrl, { signal: abortController.signal });

            // Catch HTTP errors (e.g., 404, 500)
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const entries = (await response.json()) as DatamuseEntry[];
            const firstEntry = entries[0];

            // Validation: Check if definitions exist in the JSON response
            if (!firstEntry?.defs?.length) {
                throw new Error(`No definition found for "${word}".`);
            }

            const rawDefinition = firstEntry.defs[0];
            if (!rawDefinition) {
                throw new Error(`Definition text is empty for "${word}".`);
            }

            // STUDENT NOTE: Regex cleanup to strip part-of-speech prefixes (like "n\t" or "adj\t")
            return rawDefinition.replace(/^[a-z]+\t/, "").trim();
        } catch (error) {
            // Differentiate between network timeout and general API errors
            if (error instanceof Error && error.name === "AbortError") {
                throw new Error("DictionaryClient Error: The request timed out after 10 seconds.");
            }

            const errorMessage = error instanceof Error ? error.message : "Unknown API error.";
            throw new Error(`DictionaryClient Error: ${errorMessage}`);
        } finally {
            // Clean up timer memory leak regardless of success/failure
            clearTimeout(timeoutId);
        }
    }
}

/**
 * CLASS 2: WordRecorder
 * REQUIREMENT: History tracking to prevent infinite recursion loops and stop-word filtering.
 */ 
class WordRecorder {
    // Internal state array keeping track of visited words across recursive calls
    private readonly expandedWords: string[] = [];

    // STUDENT NOTE: List of common English function words (stop words) to ignore during extraction
    private readonly functionWords: string[] = [
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
        "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
        "this", "but", "his", "by", "from", "they", "we", "say", "her",
        "she", "or", "an", "will", "my", "one", "all", "would", "there",
        "their", "what", "so", "up", "out", "if", "about", "who", "get",
        "which", "go", "me", "is", "are", "was", "were", "has", "had"
    ];

    /**
     * Checks if a word was already expanded in previous tree branches.
     */
    hasBeenExpanded(word: string): boolean {
        return this.expandedWords.includes(word.toLowerCase());
    }

    /**
     * Marks a word as processed in our global history list.
     */
    record(word: string): void {
        this.expandedWords.push(word.toLowerCase());
    }

    /**
     * Parses a definition text and picks candidate words to explore next.
     * Uses Regex to match words with >= 4 letters and filters out stop words / visited words.
     */
    extractCandidateWords(definition: string, maximumWords: number = 2): string[] {
        // Match words with 4 or more alphabetic characters
        const wordsInDefinition: string[] = definition.toLowerCase().match(/[a-z]{4,}/g) ?? [];
        const candidateWords: string[] = [];

        for (const word of wordsInDefinition) {
            const isCommonWord = this.functionWords.includes(word);
            const alreadyExpanded = this.hasBeenExpanded(word);
            const isAlreadyCandidate = candidateWords.includes(word);

            // Filter logic: Must not be common, already visited, or duplicate in current candidate list
            if (!isCommonWord && !alreadyExpanded && !isAlreadyCandidate) {
                candidateWords.push(word);
            }

            // Cap the branching factor (maximum children per node)
            if (candidateWords.length >= maximumWords) {
                break;
            }
        }

        return candidateWords;
    }
}

/**
 * CLASS 3: TreePrinter
 * REQUIREMENT: Visual formatting and display of the recursive tree in CLI using ANSI colors.
 */
class TreePrinter {
    /**
     * Recursively traverses and displays the WordNode hierarchy.
     */
    printTree(node: WordNode, prefix: string = "", isLastNode: boolean = true): void {
        // Choose ASCII tree branch symbols
        const branchSymbol = isLastNode ? "└── " : "├── ";
        
        // STUDENT NOTE: '\x1b[36m' adds Cyan color in terminal, '\x1b[0m' resets formatting.
        const coloredWord = `\x1b[36m${node.word.toUpperCase()}\x1b[0m`;
        console.log(`${prefix}${branchSymbol}${coloredWord}: ${node.definition}`);

        // Calculate indentation prefix for child branches
        const childPrefix = prefix + (isLastNode ? "    " : "│   ");
        for (let index = 0; index < node.children.length; index++) {
            const child = node.children[index];
            if (child) {
                const isLastChild = index === node.children.length - 1;
                this.printTree(child, childPrefix, isLastChild);
            }
        }
    }
}

/**
 * RECURSIVE ENGINE FUNCTION: exploreWord
 * REQUIREMENT: Core recursive algorithm that fetches data and builds the tree up to a given depth.
 */
async function exploreWord(
    word: string,
    remainingDepth: number,
    dictionaryClient: DictionaryClient,
    wordRecorder: WordRecorder
): Promise<WordNode> {
    // Step 1: Mark word as visited to avoid cycles
    wordRecorder.record(word);

    // Step 2: Fetch definition asynchronously
    const definition = await dictionaryClient.fetchDefinition(word);
    const node: WordNode = {
        word,
        definition,
        children: []
    };

    // STUDENT NOTE: RECURSION BASE CASE
    // When remainingDepth reaches 0, stop expanding and return leaf node.
    if (remainingDepth === 0) {
        return node;
    }

    // Step 3: Extract candidate words from definition for child nodes
    const candidateWords = wordRecorder.extractCandidateWords(definition, 2);

    // STUDENT NOTE: RECURSIVE STEP
    // Use Promise.all to concurrently execute asynchronous recursive calls for all children.
    const children = await Promise.all(
        candidateWords.map(async (candidateWord): Promise<WordNode | null> => {
            try {
                // Decrement depth towards base case (remainingDepth - 1)
                return await exploreWord(candidateWord, remainingDepth - 1, dictionaryClient, wordRecorder);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error.";
                // Soft error handling: log warning yellow text ('\x1b[33m') and skip broken child branch
                console.warn(`\x1b[33m[Skip] Could not expand "${candidateWord}": ${message}\x1b[0m`);
                return null;
            }
        })
    );

    // Attach valid child nodes to current node
    for (const child of children) {
        if (child) {
            node.children.push(child);
        }
    }

    return node;
}

/**
 * CLI ENTRY POINT: runDictionary
 * Controls user interaction flow, instantiates service classes, and handles application errors.
 */
async function runDictionary(): Promise<void> {
    console.log("=========================================");
    console.log("  Vocabulary Tree Explorer (TypeScript)  ");
    console.log("=========================================\n");

    try {
        const enteredWord = await askQuestion("Enter an English word to explore: ");
        const cleanedWord = enteredWord.toLowerCase();

        if (!cleanedWord) {
            console.log("Please enter a valid word.");
            return;
        }

        console.log(`\nSearching and expanding "${cleanedWord}"...\n`);

        // Instantiate core architectural modules
        const dictionaryClient = new DictionaryClient();
        const wordRecorder = new WordRecorder();
        const treePrinter = new TreePrinter();

        // Kick off recursive exploration starting at depth 1 (expands root + direct children)
        const vocabularyTree = await exploreWord(cleanedWord, 1, dictionaryClient, wordRecorder);

        // Display formatted CLI output
        console.log("Vocabulary Result Tree:\n");
        treePrinter.printTree(vocabularyTree);
        console.log("\nDone!");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown program error.";
        console.error(`\x1b[31mError: ${message}\x1b[0m`);
    } finally {
        // Always close input stream to prevent memory leak / hanging terminal process
        rl.close();
    }
}

// Execute program
runDictionary();