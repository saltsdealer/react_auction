import { dbChat, dbSchema } from '../db.js'
import { openai } from '../openAI.js'

const generateSqlQuery = async (userPrompt, user_id) => {
    const prompt = `current user's user_id: ${user_id}\n${dbSchema}\n\n${userPrompt}`
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-1106-preview",
            temperature: 0.2,
        });

        const fullResponse = completion.choices[0].message.content;
        
        const sqlQuery = extractSqlQuery(fullResponse);
        return sqlQuery
    }catch(error) {
        console.error("Error in generating SQL query:", error)
        return error
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

const executeQuery = async (sqlQuery) => {
    return new Promise((resolve, reject) => {
        dbChat.query(sqlQuery, (error, results, fields) => {
            if (error) {
                console.error('Error in query:', error)
                reject(error)
            }else {
                resolve(results)
            }
        })
    })
}

export const query = async (req, res) => {
    try {
        const userPrompt = req.body.query || "select all columns from the 'User' table"
        const user_id = req.body.user_id
        console.log("id", user_id)
        const sqlQuery = await generateSqlQuery(userPrompt, user_id)

        const results = await executeQuery(sqlQuery)
        
        res.send(results)
    }catch (error) {
        console.error('Error in generateSqlQuery:', error);
        res.status(500).json({ error: 'Error generating SQL query', details: error.message })
    }
}

export default query
