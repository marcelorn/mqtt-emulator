const minimist = require('minimist');
const filesys = require('fs');

const doHelp = (argumentHelp) => {

  const text = `Options:
   --R, --r,    --run                                               Start device emulator
       options: --CF,  --cf,  --config-file=FILE                    Use external JSON configuration file.
                --S,   --s,   --save                                Save emulated data to  ./tmp/current_date_in_ms.txt file
                --D,   --d,   --debug                               Print debug information to console.
                --DF,  --df,  --distributions-file=FILE             Loads a JSON file with generated data. Used to repeat a dataset.                

   --DS, --ds, --debug-server                              Starts a server on localhost:3000 showing the generated data on histograms

   --F,  --f,  --flush                                     Cleans the temporary folder ./tmp
  
   Default options:
   --R --CF=config.json`;

  console.log(text);
};

module.exports = (description, args, processFunction, argumentHelp) => {
  args = minimist(args, {
    string: ['config-file', 'distributions-file'],
    boolean: ['run', 'debug-server', 'flush', 'save', 'debug'],
    alias: {
      run: ['R', 'r', 'run'],
      configFile: ['CF', 'cf', 'config-file'],
      distributionsFile: ['DF', 'df', 'distributions-file'],      
      debugServer: ['DS', 'ds', 'debug-server'],
      flush: ['F', 'f', 'flush'],
      debug: ['D', 'd', 'debug'],
      save: ['S', 's', 'save'],
      help: ['H', 'h', 'help']
    },
    default: {
      configFile: 'config.json',
      debug: false,
      show: false
    },
    unknown: function () {
      console.error('***Parâmetros informados desconhecidos***');
      doHelp();
      process.exit(1);
    }
  });
  if (args.help) {
    doHelp();
    return;
  }

  if (!args.run && !args.debugServer && !args.flush) {
    args.run = true;
  }

  processFunction(args);
};
