// Example 1: A generic function works with different types.
function printValue<Type>(value: Type): void {
    console.log(value);
}

printValue<string>("A text value");
printValue<number>(25);

// Example 2: A generic function returns the first item.
function getFirstItem<Type>(items: Type[]): Type {
    return items[0] as Type;
}

console.log(getFirstItem<string>(["red", "blue"]));
console.log(getFirstItem<number>([10, 20]));
