import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext';
import DynamicTable from '../components/DynamicTable'

const Chat = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate()

    const [query, setQuery ] = useState('')
    const [results, setResults ] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!currentUser) {
            navigate("/login")
        }
    }, [currentUser, navigate])

    const handleQuerySubmit = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
       
        try {
            const response = await fetch('http://localhost:8800/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    query,
                    user_id: currentUser.user_id ? currentUser.user_id : currentUser.admin_id,

                }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }

            const data = await response.json()
            setResults(data)
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
            {error ? 
                (
                <div>Error: {error}</div>
                ) : (
                <div>
                    <DynamicTable data={results} />
                </div>
                )
            }
        </div>
    )
}

export default Chat