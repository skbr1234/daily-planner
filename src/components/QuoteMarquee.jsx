import { useState, useEffect } from 'react'

const QuoteMarquee = () => {
  const [quote, setQuote] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const fetchQuote = async () => {
      const today = new Date().toISOString().slice(0, 10)
      const lastQuoteDate = localStorage.getItem('daily-planner-last-quote-date')
      
      if (lastQuoteDate !== today) {
        try {
          const response = await fetch('https://api.quotable.io/random?tags=motivational,inspirational,success')
          const data = await response.json()
          const newQuote = { text: data.content, author: data.author }
          
          const quotes = JSON.parse(localStorage.getItem('daily-planner-quotes') || '[]')
          quotes.push({ ...newQuote, date: today })
          localStorage.setItem('daily-planner-quotes', JSON.stringify(quotes))
          localStorage.setItem('daily-planner-last-quote-date', today)
        } catch (error) {
          console.error('Failed to fetch quote:', error)
        }
      }
      
      const quotes = JSON.parse(localStorage.getItem('daily-planner-quotes') || '[]')
      if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        setQuote(`"${randomQuote.text}" — ${randomQuote.author}`)
        setIsVisible(true)
      }
    }

    fetchQuote()
  }, [])

  if (!isVisible) return null

  return (
    <div className="w-full bg-gray-100 bg-opacity-50 py-1 overflow-hidden">
      <div className="text-xs text-gray-600 marquee-scroll">
        {quote}
      </div>
    </div>
  )
}

export default QuoteMarquee