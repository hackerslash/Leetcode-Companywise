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
    }).filter(company => company.files.length > 0);

    const outputData = {
        lastUpdated: new Date().toISOString().split('T')[0],
        companies: companyData
    };

    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
    console.log(`Generated companies.json with ${companyData.length} companies and date ${outputData.lastUpdated}.`);

    // Build reverse index: question ID -> [company names]
    const questionCompanies = {};

    for (const company of companyData) {
        const filesToScan = company.files.includes('all.csv') ? ['all.csv'] : company.files;
        for (const file of filesToScan) {
            const csvPath = path.join(dataDir, company.name, file);
            try {
                const lines = fs.readFileSync(csvPath, 'utf-8').split('\n').slice(1);
                for (const line of lines) {
                    const id = line.trim().split(',')[0].replace(/"/g, '').trim();
                    if (id && /^\d+$/.test(id)) {
                        if (!questionCompanies[id]) questionCompanies[id] = [];
                        if (!questionCompanies[id].includes(company.name)) {
                            questionCompanies[id].push(company.name);
                        }
                    }
                }
            } catch (_) { /* skip unreadable files */ }
        }
    }

    const qcFile = path.join(__dirname, 'public/question_companies.json');
    fs.writeFileSync(qcFile, JSON.stringify(questionCompanies));
    console.log(`Generated question_companies.json with ${Object.keys(questionCompanies).length} questions.`);
} catch (err) {
    console.error('Error scanning directory:', err);
}
