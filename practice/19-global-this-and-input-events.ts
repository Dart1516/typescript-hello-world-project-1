interface SimpleInput {
    on(event: "data", listener: (value: string) => void): this;
    removeListener(event: "data", listener: (value: string) => void): this;
    send(value: string): void;
}

// Example 1: Read a value from globalThis.
const settings = (globalThis as typeof globalThis & { appName: string });
settings.appName = "Practice App";
console.log(settings.appName);

// Example 2: Add and remove a listener for input data.
class TestInput implements SimpleInput {
    private listener: ((value: string) => void) | undefined;

    on(event: "data", listener: (value: string) => void): this {
        this.listener = listener;
        return this;
    }

    removeListener(event: "data", listener: (value: string) => void): this {
        if (this.listener === listener) {
            this.listener = undefined;
        }
        return this;
    }

    send(value: string): void {
        this.listener?.(value);
    }
}

const testInput = new TestInput();
const receiveValue = (value: string): void => {
    console.log(`Received: ${value}`);
    testInput.removeListener("data", receiveValue);
};

testInput.on("data", receiveValue);
testInput.send("first value");
testInput.send("ignored value");
