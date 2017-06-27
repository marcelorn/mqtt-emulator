const probabilityDistributions = {
    NORMAL: 'normal',
    GAUSS: 'gauss',
    BINOMIAL: 'binomial',
    UNIFORM: 'uniform',
    POISSON: 'poisson',
}

const expressions = {    
    FILE: 'file',
    ROUTE: 'route'
};

Object.keys(probabilityDistributions).forEach(key=>{
    expressions[key] = probabilityDistributions[key];
});

const list = Object.keys(expressions).map(type => { return expressions[type] });

module.exports = {
    expressions,
    probabilityDistributions,
    list,
}

