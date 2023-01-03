const fs = require('fs');

const icons = fs.readFileSync('./icons.json', { encoding: 'utf-8' });

console.log(JSON.parse(icons).length);
