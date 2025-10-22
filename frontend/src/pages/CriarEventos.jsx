import { useState } from 'react'

function CriarEventos() {
  const [evento, setEvento] = useState({
    eventTitle: '',
    eventDescription: '',
    eventCategory: 'Musica',
    startDate: '',
    eventLocation: '',
    ticketPrice: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento)
      })
      if (response.ok) {
        alert('Evento criado com sucesso!')
        setEvento({
          eventTitle: '',
          eventDescription: '',
          eventCategory: 'Musica',
          startDate: '',
          eventLocation: '',
          ticketPrice: ''
        })
      }
    } catch (error) {
      alert('Erro ao criar evento')
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Criar Evento</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Evento
            </label>
            <input
              type="text"
              value={evento.eventTitle}
              onChange={(e) => setEvento({...evento, eventTitle: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={evento.eventDescription}
              onChange={(e) => setEvento({...evento, eventDescription: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={evento.eventCategory}
              onChange={(e) => setEvento({...evento, eventCategory: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Musica">Música</option>
              <option value="Teatro">Teatro</option>
              <option value="Cinema">Cinema</option>
              <option value="Arte">Arte</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data e Hora
            </label>
            <input
              type="datetime-local"
              value={evento.startDate}
              onChange={(e) => setEvento({...evento, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local
            </label>
            <input
              type="text"
              value={evento.eventLocation}
              onChange={(e) => setEvento({...evento, eventLocation: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço do Ingresso
            </label>
            <input
              type="number"
              value={evento.ticketPrice}
              onChange={(e) => setEvento({...evento, ticketPrice: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" className="w-full btn-primary">
            Criar Evento
          </button>
        </form>
      </div>
    </main>
  )
}

export default CriarEventos