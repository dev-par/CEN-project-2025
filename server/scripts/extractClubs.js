import fs from 'fs';
import pdf from 'pdf-parse-debugging-disabled';
import path from "path";
import db from "../db/connect.js"
import { MongoClient } from 'mongodb';

async function extractClubNames(pdfPath) {
    const absolutePath = path.resolve(pdfPath);

    const dataBuffer = fs.readFileSync(absolutePath);

    const data = await pdf(dataBuffer);

    const text = data.text;
    return text;
}

function parseClubNames(extractedText) {
    const lines = extractedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const excludeKeywords = [
        "Correct as of",
        "Copyright",
        "Page ",
        "Directory of Organizations",
        "Department of Student Activities and Involvement",
        "Organization"
    ]

    const clubNames = lines.filter(line => {
        return !excludeKeywords.some(keyword => line.includes(keyword));
    })

    const uniqueClubNames = [...new Set(clubNames)];

    return uniqueClubNames;
}

async function bulkInsertClubs(uniqueClubNames) {
    const clubsCollection = db.collection('clubs');

    const clubObjects = uniqueClubNames.map(name => ({
        name,
        createdAt: new Date(),
        updatedAt: new Date()
    }))

    try {
        const result = await clubsCollection.insertMany(clubObjects);
        console.log("Bulk insert successful. Inserted IDs:", result.insertedIds);
    }
    catch (err) {
        console.error("Error during bulk insert:", err);
    }
}

async function main() {
    const pdfPath = "scripts/clubNames.pdf";
    try {
        const rawText = await extractClubNames(pdfPath);
        const clubNames = parseClubNames(rawText);
        await bulkInsertClubs(clubNames);
    }
    catch (err) {
        console.error("Error processing PDF", err)
    }
}

main();