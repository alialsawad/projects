const fs = require("fs");
const path = require("path");

function createJsonFiles() {
    const data = fs.readFileSync("queries.txt", "utf8");
    const queries = data.split("\n"); // Split the file by newline character

    queries.forEach((query, index) => {
        const filename = path.join(__dirname, `query${index + 1}.json`); // Generate a filename for each query
        const jsonData = {
            title: `Query ${index + 1}`,
            query: query.trim(),
            response: {
                code: 200,
                body: {},
            },
        }; // Create a JSON object with the query

        fs.writeFileSync(filename, JSON.stringify(jsonData, null, 4)); // Write the JSON object to the file
    });
}

createJsonFiles();
