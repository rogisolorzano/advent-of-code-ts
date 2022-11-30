const logHello = async () => console.log('Hello world!');

async function start() {
  await logHello();
}

start();
