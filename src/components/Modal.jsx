const Modal = ({ show, message, onClose }) => {
  if (!show) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-xl z-50 min-w-80">
        <p className="text-center font-semibold mb-4">{message}</p>
        <button 
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          OK
        </button>
      </div>
    </>
  )
}

export default Modal