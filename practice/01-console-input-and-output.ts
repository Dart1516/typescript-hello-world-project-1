import * as readline from 'readline';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

console.log('--- Ejemplo 1: una sola pregunta ---');
rl.question('¿Cómo te llamas? ', (nombre) => {
  console.log(`Hola, ${nombre}!`);

  console.log('--- Ejemplo 2: varias preguntas ---');
  rl.question('¿Cuántos años tienes? ', (edad) => {
    console.log(`Tienes ${edad} años.`);

    rl.question('¿De qué ciudad eres? ', (ciudad) => {
      console.log(`Vives en ${ciudad}.`);
      rl.close();
    });
  });
});

