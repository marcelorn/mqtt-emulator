const cmdLineProcess = require('./cmdline');
const emulator = require('./app/emulator');
const appRoot = require('app-root-path');
const { exec, fork } = require('child_process');

module.exports = cmdLineProcess;

flush = () => {
      const folder = `${appRoot.path}/tmp`;
      exec(`rm -r  ${folder}`);
      console.log(`Tmp folder removed. (${folder})`);
}

debugServer = () => {
      console.log('Starting debug server.');
      const child = fork('./server/server-fork');
      child.on('message', m => {
            console.log(`Execute 'kill -9 ${m}' to stop the server.`);
            process.exit(1);
      });
      child.send('');
}

app = args => {
      if (args.run) {
            console.log('Device emulator starting...');
            emulator(args);
      } else if (args.flush) {
            flush();
      } else if (args.debugServer) {
            debugServer();
      }
}

if (require.main === module) {
      cmdLineProcess('Device Emulator.',
            process.argv.slice(2), app);
}
