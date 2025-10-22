import { useState, useEffect } from 'react'

function MeusEventos() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Meus Eventos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map(evento => (
          <div key={evento.id} className="event-card">
            <h3 className="text-lg font-semibold mb-2">{evento.tituloEvento}</h3>
            <p className="text-gray-600 mb-2">{evento.descricao}</p>
            <p className="text-sm text-gray-500 mb-2">{evento.localizacao}</p>
            <div className="flex justify-between items-center">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                {evento.disponibilidade}
              </span>
              <span className="text-sm font-medium text-blue-600">
                R$ {evento.preco}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {eventos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Você ainda não criou nenhum evento.</p>
        </div>
      )}
    </main>
  )
}

export default MeusEventos