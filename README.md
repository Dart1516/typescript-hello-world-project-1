# Overview

I am building a command-line vocabulary learning tool to improve my TypeScript and software engineering skills. The program works like a dictionary, but it also finds up to two useful words inside each definition. These extra words give English learners more context when a definition contains unfamiliar words.

The program asks the user for an English word, sends an asynchronous request to the Datamuse API, and prints a vocabulary tree in the terminal. Each tree node contains the word, its definition, and related words found in that definition.

The software demonstrates TypeScript features including types, interfaces, classes, lists, recursion, asynchronous functions, exception handling, regular expressions, and API communication. TypeScript provides static type checking and editor support while still producing JavaScript that runs on Node.js.

[Software Demo Video](https://youtu.be/TVa3CE9Oisc)


[GitHub Repository](https://github.com/Dart1516/typescript-hello-world-project-1.git)

The demonstration video shows my face, the software running in the terminal, and a walkthrough of the code. It is approximately four to five minutes long.

## Submission Checklist

- Video created and published: includes the student's face, a terminal demo, and a code walkthrough. 10/10
- GitHub repository created and populated: public repository includes the final project files. 10/10
- Module requirements implemented: dictionary app includes input, API usage, tree output, classes, recursion, lists, async functions, and exception handling. 40/40
- Code size and comments: project is over 100 lines and includes explanatory comments on the functions and classes created. 10/10
- README completed at the root of the project and matches the required template. 10/10
- Time log completed and meets the minimum requirement of 20 hours. 10/10

# Development Environment

I developed this project in Visual Studio Code on Windows. I used Node.js to run the TypeScript files directly in the terminal. The project uses the built-in `fetch` API to communicate with Datamuse and does not require an external runtime library.

The programming language is TypeScript. The program uses interfaces to describe data, classes to separate responsibilities, arrays to store lists, `async` and `await` for API requests, `Promise.all` for parallel child requests, recursion to build the vocabulary tree, and `try`, `catch`, and `finally` for exception handling.

The three main classes are:

- `DictionaryClient` communicates with the external dictionary API.
- `WordRecorder` remembers expanded words and filters common words.
- `TreePrinter` formats and displays the vocabulary tree.

The recursive `exploreWord` function stops when the remaining depth reaches zero. `WordRecorder` prevents infinite cycles, and the program expands a maximum of two candidate words at each level.

## Learning Practice Order

The practice files are ordered from the simplest support code to the more advanced features:

```text
00-console-input-and-output.ts   Read and write in the Node.js terminal
01-hello-world.ts                Print a first message
02-basic-types.ts                Use strings, numbers, and booleans
03-objects-and-interfaces.ts    Describe object shapes
04-classes-and-methods.ts       Create classes and methods
05-functions.ts                 Create reusable functions
06-arrays-and-loops.ts          Work with lists and repetition
07-unions-and-narrowing.ts      Work with more than one possible type
08-generics.ts                  Create reusable typed code
09-async-and-promises.ts        Wait for work that takes time
10-errors-and-validation.ts     Throw and handle errors
11-recursion.ts                 Make a function call itself
12-fetch-and-data.ts            Request data from an API
13-private-and-default-parameters.ts
14-strings-and-regular-expressions.ts
15-optional-values-and-type-assertions.ts
16-recursive-tree-and-indexed-loops.ts
17-error-types-and-finally.ts
18-abort-controller-and-timers.ts
19-global-this-and-input-events.ts
20-private-readonly-and-constants.ts
21-map-and-promise-all.ts
22-http-response-checks.ts
```

The `00` file comes first because a command-line program needs to know how to
communicate with the terminal before it can ask the user for a word.

# Useful Websites

- [TypeScript Official Website](https://www.typescriptlang.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [TypeScript From Scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript Object-Oriented Programming](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)
- [TypeScript Functions](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html)
- [TypeScript Download and Installation](https://www.typescriptlang.org/download/)
- [Datamuse API](https://www.datamuse.com/api/)
- [TypeScript on Wikipedia](https://en.wikipedia.org/wiki/TypeScript)

# Future Work

- Add a menu that lets the user choose the tree depth.
- Add a command to save the vocabulary tree to a text file.
- Add tests for `WordRecorder`, `DictionaryClient`, and `TreePrinter`.
- Add a configuration file and a standard TypeScript build command.
- Improve API error messages for offline use.
- Record and publish a final four-to-five-minute demonstration video that includes my face, a software demo, and a code walkthrough.

# Sprint Schedule

| Day | First Week | Second Week |
| --- | --- | --- |
| Monday | Set up Node.js, TypeScript, and the project folder. 2 hours | Implement the recursive function. 2 hours |
| Tuesday | Read the official documentation and run the first program. 2 hours | Prevent infinite loops with `WordRecorder`. 2 hours |
| Wednesday | Create the first terminal output and learn the API format. 2 hours | Refactor the program into the three classes. 2 hours |
| Thursday | Consume the API and fetch one definition. 2 hours | Add exception handling and request timeouts. 2 hours |
| Friday | Filter words and print one definition. 1 hour | Test the complete tree and fix bugs. 1 hour |
| Saturday | Practice TypeScript types and write project notes. 1 hour | Record and edit the demonstration video. 1 hour |
| **Total** | **10 hours** | **10 hours** |
