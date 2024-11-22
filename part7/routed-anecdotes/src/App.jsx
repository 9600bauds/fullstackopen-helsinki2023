import { useState } from 'react'
import { Routes, Route, useMatch, useNavigate, Navigate } from 'react-router-dom'
import { AnecdoteList } from './components/AnecdoteList'
import { About } from './components/About'
import { NewAnecdoteForm } from './components/NewAnecdoteForm'
import { Footer } from './components/Footer'
import { Menu } from './components/Menu'
import { Anecdote } from './components/Anecdote'
import { Notification } from './components/Notification'

const App = () => {
  const navigate = useNavigate();

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])
  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)
  const individualAnecdoteMatch = useMatch('/anecdotes/:id') 
  const individualAnecdote = individualAnecdoteMatch
    ? anecdoteById(Number(individualAnecdoteMatch.params.id))
    : null

  const [notification, setNotification] = useState('')
  const showNotification = (message, seconds = 5) => {
    setNotification(message);

    // Effectively refresh the timer if a notification already existed
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout);
    }

    window.notificationTimeout = setTimeout(() => {
      setNotification();
    }, seconds * 1000);
  };


  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    showNotification(`Added new anecdote: ${anecdote.content}!`)
    navigate('/')
  }


  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    showNotification(`Voted on anecdote: ${anecdote.content}!`)

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notificationText={notification}/>
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/anecdotes/:id" element={
          individualAnecdote ?
          <Anecdote anecdote={individualAnecdote} /> :
          <Navigate replace to="/" />
        } />
        <Route path="/new" element={<NewAnecdoteForm addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>     
      <Footer />
    </div>
  )
}

export default App
