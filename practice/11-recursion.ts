// Example 1: Count down with recursion.
function countDown(number: number): void {
    if (number === 0) {
        console.log("Finished!");
        return;
    }

    console.log(number);
    countDown(number - 1);
}

countDown(3);

// Example 2: Add numbers with recursion.
function sumTo(number: number): number {
    if (number === 0) {
        return 0;
    }

    return number + sumTo(number - 1);
}

console.log(`Sum: ${sumTo(4)}`);
