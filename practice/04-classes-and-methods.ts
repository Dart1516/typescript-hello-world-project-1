// Example 1: Create a class with a method.
class Student {
    name: string;
    grade: number;

    constructor(name: string, grade: number) {
        this.name = name;
        this.grade = grade;
    }

    introduce(): void {
        console.log(`My name is ${this.name}. My grade is ${this.grade}.`);
    }
}

const firstStudent = new Student("Ana", 90);
firstStudent.introduce();

// Example 2: Create another class with a method.
class Dog {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    bark(): void {
        console.log(`${this.name} says woof!`);
    }
}

const firstDog = new Dog("Max");
firstDog.bark();
