import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'public/data');
const outputFile = path.join(__dirname, 'public/companies.json');

try {
    const companies = fs.readdirSync(dataDir).filter(file => {
        return fs.statSync(path.join(dataDir, file)).isDirectory();
    }).sort();
    
    const companyData = companies.map(company => {
        const companyPath = path.join(dataDir, company);
        const files = fs.readdirSync(companyPath).filter(f => f.endsWith('.csv'));
        return {
            name: company,
            files: files
        };
    });

    const outputData = {
        lastUpdated: new Date().toISOString().split('T')[0],
        companies: companyData
    };

    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
    console.log(`Generated companies.json with ${companies.length} companies and date ${outputData.lastUpdated}.`);
} catch (err) {
    console.error('Error scanning directory:', err);
}
