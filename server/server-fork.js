const { spawn, exec, fork } = require('child_process');

process.on('message', m => {
    const child = spawn('node', ['server/app.js','&']);
    child.stdout.on('data', (data) => {        
        console.log(data.toString());
        process.send(child.pid);
    });
    child.stderr.on('data', (data) => {
        console.log(`Erro: ${data}`);
    });
    child.on('close', (code) => {
        console.log(`Parando servidor.`);
    });
    child.on('exit',(code, signal)=>{
        process.exit(1);
    });
});