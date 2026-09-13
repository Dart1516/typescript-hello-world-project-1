const user1 = {
    name: "David",
    id: 1,
}
console.log(typeof user1.name);
console.log(typeof user1.id);   

interface User {
    name: string;
    id: number;
}

 
class UserAccount {
    name: string;
    id: number;
    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }
}

const user: User = new UserAccount("David", 1); 
console.log(user.name); 
console.log(user.id); 


/* Composing types*/ 

type Myboolean = true | false;
const myBool: Myboolean = true;
console.log(myBool);
 
let s: string;
s = "Hello, World!";
console.log(typeof s);
let n: number = 42;
console.log(typeof n);

function envolverEnArreglo(valor: string | string[]): string[] {
  if (typeof valor === "string") {
    return [valor];   // aquí TypeScript sabe que `valor` es string
  }
  return valor;       // aquí sabe que ya es string[] porque en la linea anterior lo devolvió como arreglo
}

    /*generic  

    means a value that can be anything */
    type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;

/*we can declare your own types that use generics*/ 

interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}
 
let backpackItem: string = "notebook";

const backpack: Backpack<string> = {
  add: (obj: string): void => {
    backpackItem = obj;
  },
  get: (): string => backpackItem
};
 
// object is a string, because we declared it above as the variable part of Backpack.
const object = backpack.get();
console.log(object);

backpack.add("pencil");
console.log(backpack.get());