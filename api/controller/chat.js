import { db } from '../db.js'
import { openai } from '../openAI.js'

const generateSqlQuery = async (userPrompt) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: userPrompt }],
            model: "gpt-4-1106-preview",
            temperature: 0.2,
        });

        const fullResponse = completion.choices[0].message.content;
        
        const sqlQuery = extractSqlQuery(fullResponse);
        return sqlQuery
    }catch(error) {
        console.error("Error in generating SQL query:", error)
    }
}

function extractSqlQuery(fullResponse) {
    // Regular expression to find SQL query within the response
    const sqlRegex = /```sql\n([\s\S]*?)\n```/;
    const matches = fullResponse.match(sqlRegex);

    if (matches && matches[1]) {
        return matches[1].trim();
    } else {
        return "No SQL query found.";
    }
}

export const query = async (req, res) => {
    try {
        //console.log('req.body:', req.body.query)
        const userPrompt = req.body.query || "Generate an SQL query to select all columns from the 'User' table"
    
        const sqlQuery = await generateSqlQuery(userPrompt)

        db.query(sqlQuery, (error, results, fields) => {
            if (error) {
                console.error('Error in query:', error)
                res.status(500).json({ error: 'Database query failed', details: error.message })
                return
            }
            res.send(results)
            //console.log(res.json)
        });
    }catch (error) {
        console.error('Error in generateSqlQuery:', error);
        res.status(500).json({ error: 'Error generating SQL query', details: error.message })
    }
}

export default query
