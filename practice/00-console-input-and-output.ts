// ============================================================================
// 00. CONSOLE INPUT AND OUTPUT
// ============================================================================

// stdin means "standard input".
// It is the stream where Node.js receives text typed by the user.
interface PracticeTerminalInput {
    setEncoding(encoding: string): void;
    on(event: "data", listener: (typedText: string) => void): this;
    removeListener(event: "data", listener: (typedText: string) => void): this;
}

// stdout means "standard output".
// It is the stream where Node.js writes text in the terminal.
interface PracticeTerminalOutput {
    write(text: string): boolean;
}

interface PracticeNodeProcess {
    stdin: PracticeTerminalInput;
    stdout: PracticeTerminalOutput;
}

const practiceProcess = (
    globalThis as typeof globalThis & { process: PracticeNodeProcess }
).process;

const practiceInput = practiceProcess.stdin;
const practiceOutput = practiceProcess.stdout;

// Example 1: Write text directly to stdout.
// write() does not add a new line automatically.
practiceOutput.write("Example 1: This text comes from stdout.\n");

// Example 2: Read one answer from stdin.
practiceOutput.write("Example 2: What is your name? ");
practiceInput.setEncoding("utf8");

const receivePracticeAnswer = (typedText: string): void => {
    // Remove the listener because this example needs only one answer.
    practiceInput.removeListener("data", receivePracticeAnswer);

    // The terminal sends a line break after the answer.
    const name = typedText.split(/\r?\n/, 1)[0] ?? "";
    practiceOutput.write(`Hello, ${name}!\n`);
};

// The "data" event runs this function when the user types something.
practiceInput.on("data", receivePracticeAnswer);
