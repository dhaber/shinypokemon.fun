import { createWorker } from 'tesseract.js';

async function main() {
    const worker = await createWorker('eng');
    const ret = await worker.recognize('./1000002465.jpg');
    console.log(ret.data.text);
    await worker.terminate();
}

(async () => { 
    try {
        await main();
    } catch (e) {
        console.log("error", e);
    }
})()