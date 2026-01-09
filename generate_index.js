const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(__dirname, 'companies.json');

try {
    const companies = fs.readdirSync(dataDir).filter(file => {
        return fs.statSync(path.join(dataDir, file)).isDirectory();
    }).sort();
    
    fs.writeFileSync(outputFile, JSON.stringify(companies, null, 2));
    console.log(`Generated companies.json with ${companies.length} companies.`);
} catch (err) {
    console.error('Error scanning directory:', err);
}
