import { useState } from 'react'

const InfoButton = () => {
  const [showFooter, setShowFooter] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowFooter(true)}
        className="fixed bottom-8 right-8 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20"
        aria-label="Show app information"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </button>

      {showFooter && (
        <div className="fixed bottom-24 right-8 bg-white p-6 rounded-2xl shadow-xl z-10">
          <button
            onClick={() => setShowFooter(false)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close information popup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          <footer className="text-center text-gray-700 text-xs">
            © 2025 - {new Date().getFullYear()} <strong>PlanMyDaily.com</strong> - Free Online Daily Planner & Task Manager. All rights reserved.
          </footer>
        </div>
      )}
    </>
  )
}

export default InfoButton