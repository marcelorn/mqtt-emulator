const protocol = {
    type: 'object',
    properties: {
        mqtt: {
            type: 'object',
            properties: {
                port: {
                    type: 'integer'
                },
                serverAddress: {
                    type: 'string'
                },
                topic: {
                    type: 'string'
                }
            },
            required: ['serverAddress', 'port', 'topic']
        }
    },
    required: ['mqtt']
};

const maps = {
    type: 'object',
    properties: {
        key: {
            type: 'string'
        }
    },
    required: ['key']
}

const device = {
    type: 'object',
    properties: {
        frequency: {
            oneOf: [
                {
                    type: 'string',
                    pattern: "^(\\w+)\\((.*|)\\)$"
                },
                {
                    type: 'integer'
                },
                {
                    type: 'object',
                    properties: {
                        columnTime: {
                            type: 'string',
                            pattern: "^(\\w+)\\((.*|)\\)$"
                        },
                        columnTimeFormat: {
                            type: 'string',
                        },
                        columnDate: {
                            type: 'string',
                            pattern: "^(\\w+)\\((.*|)\\)$"
                        },
                        columnDateFormat: {
                            type: 'string'
                        }
                    },
                    required: ['columnTime', 'columnTimeFormat']
                }
            ]
        },
        duration: {
            type: 'integer'
        },
        accelerate: {
            type: 'number',
            default: 1
        },
        sensors: {
            type: 'array',
            minItems: 1,
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    value: {
                        type: 'string',
                        pattern: "^(\\w+)\\((.*|)\\)$"
                    }
                },
                required: ['name', 'value']
            }
        }
    },
    required: ['frequency', 'sensors']
};

const csv = {
    type: 'object',
    properties: {
        accelerate: {
            type: 'number',
            default: 1
        },
        file: {
            type: 'string'
        },
        columnDate: {
            type: 'string'
        },
        columnDateFormat: {
            type: 'string'
        },
        columnTime: {
            type: 'string'
        },
        columnTimeFormat: {
            type: 'string'
        },
        columns: {
            type: 'array'
        }
    },
    required: ['file', 'columnDate', 'columnDateFormat']
}

const schema = {
    type: 'object',
    properties: {
        protocol,
        maps,
        device,
        csv
    },
    required: ['protocol']
};

module.exports = schema;