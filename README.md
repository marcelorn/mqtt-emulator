# Device Emulator

### Instalation
Device emulator requires:
* [npm](https://nodejs.org/en/download/package-manager/) 4.2.0+
* [node.js](https://nodejs.org/) 7.10+

### Device Emulator needs permission to run
```sh
$ chmod +x emulator.sh
```
<br>

##### To show options
```sh
$ ./emulator.sh --h
```   
<br>

```
Options:
   --R, --r,   --run                        Start device emulator
       options: --CF, --cf, --config-file=FILE           Use external JSON configuration file.
                --S,  --s,  --save                       Save emulated data to ./tmp/current_date_in_ms.txt file
                --D,  --d,  --debug                      Print debug information to console.
                --DF, --df, --distributions-file=FILE    Loads a JSON file with generated data. Used to repeat a dataset.

   --DS, --ds, --debug-server               Starts a server on localhost:3000 showing the generated data on histograms

   --F,  --f,  --flush                      Cleans the temporary folder ./tmp
  
   Default options:
   --R --CF=config.json
``` 
<br>

##### Running Device Emulator
- To run with the default configurations:
```sh
$ ./emulator.sh
```    
The default config.json is as shown
```json
        {
            "protocol": {
                "mqtt":{
                    "serverAddress": "10.101.40.50",
                    "port": 1883,
                    "topic": "/AAFF9977/s001/attrs"
                },
            },
            "device":{
                "frequency": 1000,
                "duration": 5000,
                "accelerate": 1,
                "sensors": [
                    {"name": "temperature", "value": "NORMAL(23,3)"},
                    {"name": "voltage", "value": "UNIFORM(120, 135)"},
                    {"name": "doorOpen", "value": "BINOMIAL(1, 0.8)"},
                    {"name": "error", "value": "POISSON(4)"}
                ]
            }
        }   
```
<br>

- To run with custom configurations:
```sh
$ ./emulator.sh --run --config-file=/folder/config.json
```   

This will load '/folder/config.json' as configurations file. An example of a custom config.json file is shown below
```json
        {
            "protocol": {
                "mqtt":{
                    "serverAddress": "10.101.40.50",
                    "port": 1883,
                    "topic": "/AAFF9977/s012/attrs"
                },
            },
            "device":{
                "frequency": 2000,
                "duration": 6000,
                "accelerate": 1,
                "sensors": [
                    {"name": "temperature", "value": "NORMAL(20,3)"},
                    {"name": "voltage", "value": "UNIFORM(120, 135)"},                    
                    {"name": "error", "value": "POISSON(7)"}
                ]
            }
        }   
```

Note that the 'config.json' must to follow the json schema '[emulator-schema](app/validations/schema.js)'.

- To enable debug messages:
- ```sh
  $ ./emulator.sh --run --config-file=/folder/config.json --debug
   ```   
 An example of debug message when the debug parameter is used, is shown below:
   > Published {"temperature":23.812521971976725,"voltage":121.39947750144941,"doorOpen":1,"error":4}

- To save emulated data to a file:
- ```sh
  $ ./emulator.sh --run --save
   ```  
Save emulated data to /project_folder/tmp/current_date_in_ms.json

   ### Probability  Distributions
   The emulated data is based on probability distributions to randomize the values for a device. The available distributions are **normal/gauss**, **binomial**, **uniform** and **poisson**.
   See [probability-distributions](http://statisticsblog.com/probability-distributions/) api to more details.
   The amount of data generated is based on the frequency and the duration contained on config.json.   

### Using CSV files as data input
   A csv file containing data can also be used as input to force the emulated data. The csv file contain a column with the values to be sent and another column with the frequency to send data. Those columns are used in the config.json file in each member respectively. 

  
   ```json
       {
           "protocol": {
               "mqtt":{
                   "serverAddress": "10.101.40.50",
                   "port": 1883,
                   "topic": "/AAFF9977/s012/attrs"
               }
           },
           "device":{
               "frequency": "FILE(/folder/data.csv:1)",               
               "accelerate": 0.5,
               "sensors": [
                   {"name": "temperature", "value": "FILE(/folder/data.csv:2)"},
                   {"name": "voltage", "value": "UNIFORM(120, 135)"}
               ]
           }
       }
   ```
   Where '/folder/data.csv:1' refers to column 1 with frequency and '/folder/data.csv:2' refers to column 2 with values;

   Example of csv file:
   ```
       3000,18
       6000,18.5
       700,19
       8000,19.5
       1000,20
       12000,20.5
       1000,21
       16000,21.5
       1000,22
       20000,22.5
       2000,23
       24000,23.5
       2000,24
   ```

   The csv file can be used to configure the execution in anothers way. When it has a header, to reference the columns the name of them must be used. E.g.:
   ```json
   ...
    "device":{
        "frequency": "FILE(/folder/data2.csv:frequency)",
            "accelerate": 1,
            "sensors": [
                {"name": "temperature", "value": "FILE(/folder/data2.csv:temperature)"},
                {"name": "voltage", "value": "FILE(/folder/data2.csv:voltage)"}
            ]
        }
   ...
   ``` 
   data2.csv file:

   ```
        frequency,temperature,voltage
        3000,18,12
        6000,18.5,14
        700,19,20
        8000,19.5,29
        1000,20,59
   ```

   The frequency configuration could be define by a composition of columns that represents a date and a time with their specifics formats:

   ```json
   ...
    "device": {
        "accelerate": 3600,    
        "frequency": {
            "columnTime": "FILE(/folder/data.csv:time)",
            "columnTimeFormat": "HH:mm:ss",
            "columnDate": "FILE(/folder/data.csv:date)",
            "columnDateFormat": "YYYY-MM-DD"
        },
        "sensors": [
            {"name": "temperature", "value": "FILE(/folder/data.csv:temperature)"},
            {"name": "voltage","value": "FILE(/folder/data.csv:voltage)"}
        ]
    }
   ...
   ```
   data.csv file:

   ```
    temperature,voltage,date,time
    18,12,2017-05-17,21:00:00
    18.5,14,2017-05-17,22:00:00
    19,20,2017-05-17,23:00:00
    19.5,29,2017-05-18,00:00:00
    20,59,2017-05-18,01:00:00
   ```   
   
   The columns columnDate and ColumnDateFormat are optionals, the configuration could came from one only column. In this case you must to use columnTime and columnTimeFormat:

   ```json
   ...
    "device": {
        "accelerate": 3600,    
        "frequency": {
            "columnTime": "FILE(/folder/data.csv:date_time)",
            "columnTimeFormat": "YYYY-MM-DD HH:mm:ss"            
        },
        "sensors": [
            {"name": "temperature", "value": "FILE(/folder/data.csv:temperature)"},
            {"name": "voltage","value": "FILE(/folder/data.csv:voltage)"}
        ]
    }
   ...
   ```

One csv file can be used to configure and generated a payload assuming that the csv must have a header and the columns name are used to compose the payload. Also must have columns to configure the frequency with columnTime/columnTimeFormat and columnDate/columnDateFormat as mensioned before:

```json
    {
        "protocol": {
            "mqtt": {
            "serverAddress": "10.101.47.51",
            "port": 1883,
            "topic": "/AAFF9977/s001/attrs"            
            }
        },
        "csv": {
            "accelerate": 36000,
            "file": "test/resources/data6.csv",
            "columnDate": "date",
            "columnDateFormat": "YYYY-MM-DD",
            "columnTime": "time",
            "columnTimeFormat": "HH:mm:ss",
            "columns":["pluviometric", "sensor_type", "temperature", "date", "time"]
        }
    }
```
The "columns" attribute is optional, when omited, all columns present in csv file will be used to generate the payload.

<br>

##### Starting debug server to see the Probability Distributions:
```sh
$ ./emulator.sh --debug-server
```
 Will run a local server on port 3000, where the distributions saved by the option '--save' will be displayed in histograms. You MUST use '--save' before running the server.

<br>

##### Cleaning the tmp folder:
```sh
$ ./emulator.sh --flush
```
<br>

### To use as a node-red node:
Requirement: [node-red](https://nodered.org/) 0.16.0+

Execute:
```sh
$ cd [EMULATOR_FOLDER]
$ sudo npm install
$ sudo npm link
$ cd [NODE-RED_FOLDER] eg: ~/.node-red
$ sudo npm link device_emulator
```
Then restart the node-red


### Example scenarios:
* Scenario 1 - [config1.json](test/resources/config1.json) with frequency and duration in milliseconds and using probability distributions to generate the payload.
```sh
    ./emulator.sh --run --config-file=test/resources/config1.json --debug --save
```

* Scenario 2 - [config2.json](test/resources/config2.json) using the csv '[data1.csv](test/resources/data1.csv)' without header. Configure the frequency using the csv column in milliseconds. Uses probability distributions and the csv columns to generate the payload.
```sh
    ./emulator.sh --run --config-file=test/resources/config2.json --debug --save
```

* Scenario 3 - [config3.json](test/resources/config3.json) using the csv '[data2.csv](test/resources/data2.csv)' with header. Configure the frequency using the CSV column in milliseconds and the others csv columns to generate the payload.
```sh
    ./emulator.sh --run --config-file=test/resources/config3.json --debug --save
```

* Scenario 4 - [config4.json](test/resources/config4.json) using the csv '[data3.csv](test/resources/data3.csv)' with header. Uses the time and date columns to configure the frequency and the others csv columns to generate the payload.
```sh
    ./emulator.sh --run --config-file=test/resources/config4.json --debug --save
```

* Scenario 5 - [config5.json](test/resources/config5.json) using the csv '[data4.csv](test/resources/data4.csv)' without header. Uses the time and date columns to configure the frequency and the others csv columns to generate the payload.
```sh
    ./emulator.sh --run --config-file=test/resources/config5.json --debug --save
```

* Scenario 6 - [config6.json](test/resources/config6.json) using the csv '[data5.csv](test/resources/data5.csv)' without header. Uses one only column with date and time to configure the frequency and the others csv columns to generate the payload.
```sh
    ./emulator.sh --run --config-file=test/resources/config6.json --debug --save
```

* Scenario 7 - [config7.json](test/resources/config7.json) using the csv '[data6.csv](test/resources/data6.csv)' with header. Uses the time and date columns to configure the frequency and specify the columns that will be used to generate the payload.
```sh
    ./emulator.sh --run --config-file=test/resources/config7.json --debug
```

* Scenario 8 - [config8.json](test/resources/config8.json) with frequency and duration in milliseconds. Uses probability distribution and route with origin and destination coordenates that creates steps based on google maps directions API to generate the payload.
```sh
    ./emulator.sh --run --config-file=test/resources/config8.json --debug
```