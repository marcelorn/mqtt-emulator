const scheduler = require('../../app/scheduler');

testFromFrequency = () => {
    console.log('testFromFrequency');    
    const config = {
        device: {
            frequency: 1000,
            duration: 10000
        }
    }
    const foo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let index = 0;
    const fnSend = () => {
        console.log(foo[index]);
        index++;
    }
    scheduler._fromFrequency(config, fnSend);
}

testFromPublicationFrequencies = () => {
    console.log('testFromPublicationFrequencies');    
    const config = {
        device: {
            frequency: 3000,
            duration: 10000,
            publicationFrequencies: [1000, 200, 700, 1000, 900, 500, 1000, 700, 1000, 500]
        }
    }
    const foo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let index = 0;
    const fnSend = () => {
        console.log(foo[index]);
        index++;
    }
    scheduler._fromPublicationFrequencies(config, fnSend);
}

//testFromFrequency();
//testFromPublicationFrequencies();