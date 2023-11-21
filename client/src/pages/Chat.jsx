import React, { useState } from 'react'
import DynamicTable from '../components/DynamicTable'

const Chat = () => {
    console.log('enter chat frontend')
    const [query, setQuery ] = useState('')
    const [results, setResults ] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleQuerySubmit = async (event) => {
        console.log('enter handlequerysubmit')
        event.preventDefault()
        setIsLoading(true)
        setError(null)
       
        try {
            console.log('enter generate sql query')
            //const query = "Generate an SQL query to select all columns from the 'User' table"
            const response = await fetch('http://localhost:8800/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
                //body: {"query":"Generate an SQL query to select all columns from the 'User' table"},
            })

            //console.log(response.headers.get("content-type"), await response.text());
            console.log('finish generate sql query')
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }
            console.log('fail generate sql query')

            const data = await response.json()
            setResults(data)
            console.log('success generate sql query')
        } catch(err) {
            setError(err.message);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="query">
            <form onSubmit={handleQuerySubmit}>
                <div className='input-wrapper'>
                    <textarea
                        type="text"
                        className="query-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your query"
                    />
                </div>
                <button type="submit" className="query-submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
            </form>
            {error && <div>Error: {error}</div>}
            <div>
                <DynamicTable data={results} />
            </div>
            {/* {results && (
                <div>
                    <h2>Results:</h2>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )} */}
            
        </div>
    )
}

export default Chat