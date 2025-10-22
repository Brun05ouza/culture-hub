import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [eventos, setEventos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('status:*')

  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error(err))
  }, [])

  const featuredEvents = [
    {
      id: 1,
      title: 'Rock in Rio – Palco Sunset',
      date: 'Hoje • 19:00–23:00',
      location: 'Parque Olímpico',
      description: 'Line-up especial com colabs e convidados surpresa.',
      image: '/img/events/rock.png',
      category: 'musica',
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'Hamlet no Municipal',
      date: '20/10 • 20:00',
      location: 'Theatro Municipal',
      description: 'Montagem clássica com nova direção e trilha original ao vivo.',
      image: '/img/events/teatro-hamlet.jpg',
      category: 'teatro',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Mostra Tarantino',
      date: '10–15/09',
      location: 'Cinemateca',
      description: 'Maratona com debates e cópias restauradas.',
      image: '/img/events/cinema-mostra.jpg',
      category: 'cinema',
      status: 'ended'
    },
    {
      id: 4,
      title: 'Bienal de Arte Contemporânea',
      date: '27/10 • 10:00',
      location: 'Pavilhão da Bienal',
      description: 'Curadoria com foco em arte latino-americana.',
      image: '/img/events/arte-bienal.webp',
      category: 'arte',
      status: 'upcoming'
    },
    {
      id: 5,
      title: 'Noite de Testes — Stand-up',
      date: 'Hoje • 21:00–23:00',
      location: 'Teatro do Centro',
      description: 'Line-up rotativo com microfone aberto.',
      image: '/img/events/comedia-standup.png',
      category: 'comedia',
      status: 'ongoing'
    },
    {
      id: 6,
      title: 'Festival de Dança de Rua',
      date: 'Sábado • 16:00',
      location: 'Praça Mauá',
      description: 'Batalhas 1v1, crews e DJs convidados.',
      image: '/img/events/danca-rua.webp',
      category: 'danca',
      status: 'upcoming'
    },
    {
      id: 7,
      title: 'Feira Gastronômica da Lapa',
      date: 'Hoje • 12:00–22:00',
      location: 'Arcos da Lapa',
      description: 'Chefs independentes, food trucks e música ao vivo.',
      image: '/img/events/food-festival.jpg',
      category: 'gastronomia',
      status: 'ongoing'
    }
  ]

  const categories = [
    { name: 'Música', icon: '/img/icons/musica.png' },
    { name: 'Teatro', icon: '/img/icons/teatro.png' },
    { name: 'Cinema', icon: '/img/icons/cinema.png' },
    { name: 'Arte', icon: '/img/icons/arte.png' },
    { name: 'Comédia', icon: '/img/icons/comedia.png' },
    { name: 'Literatura', icon: '/img/icons/literatura.png' },
    { name: 'Dança', icon: '/img/icons/dança.png' },
    { name: 'Gastronomia', icon: '/img/icons/gastronomia.png' }
  ]

  const filteredEvents = featuredEvents.filter(event => {
    const [type, value] = activeFilter.split(':')
    if (type === 'status' && value !== '*') {
      return event.status === value
    }
    if (type === 'cat') {
      return event.category === value
    }
    return true
  })

  const liveCount = featuredEvents.filter(e => e.status === 'ongoing').length

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gray-300 overflow-hidden h-96">
        <img src="/img/multidao.jpg" className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Descubra eventos culturais locais
            </h1>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Encontre e explore uma variedade de eventos acontecendo na sua cidade. Música, teatro, arte e muito mais!
            </p>
            <Link to="/criar-eventos" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Explorar Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 mb-12 relative z-10">
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <img src="/img/icons/pesquisa.png" alt="" width="20" height="20" className="w-5 h-5 opacity-60 object-contain" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Eventos em destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/detalhes" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src="/img/exposicao de arte.jpg" alt="Exposição de Arte" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">Exposição de Arte</h3>
              <p className="text-sm text-gray-500">Explore arte contemporânea de artistas locais.</p>
            </div>
          </Link>
          <Link to="/detalhes" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src="/img/musica ao vivo.jpg" alt="Show de Indie Rock" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">Música ao vivo</h3>
              <p className="text-sm text-gray-500">Uma noite de indie rock com bandas em ascensão.</p>
            </div>
          </Link>
          <Link to="/detalhes" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src="/img/teatro.jpg" alt="Peça de teatro" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">Teatro</h3>
              <p className="text-sm text-gray-500">Vivencie a comédia atemporal de Shakespeare.</p>
            </div>
          </Link>
          <Link to="/detalhes" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src="/img/cinema classico.jpg" alt="Exibição de cinema" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">Cinema Clássico</h3>
              <p className="text-sm text-gray-500">Assista a um clássico na tela grande.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Categorias</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 justify-items-center max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="mb-2">
                <img src={category.icon} className="w-8 h-8" alt="" />
              </span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Live Events Bar */}
      {liveCount > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg bg-green-50 text-green-700 border border-green-200 cursor-pointer">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <strong>{liveCount}</strong>
            <span>eventos ao vivo agora • clique para ver</span>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {[
            { key: 'status:*', label: 'Todos' },
            { key: 'status:ongoing', label: 'Ao vivo' },
            { key: 'status:upcoming', label: 'Próximos' },
            { key: 'status:ended', label: 'Encerrados' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredEvents.map(event => (
            <article
              key={event.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status === 'ongoing' ? 'Ao vivo' :
                   event.status === 'upcoming' ? 'Próximo' : 'Encerrado'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.date} • {event.location}</p>
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                <div className="mt-3">
                  <Link
                    to="/detalhes"
                    className={`inline-flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                      event.status === 'ended'
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {event.status === 'ended' ? 'Encerrado' : 'Ver detalhes'}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Weekly Highlights */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Destaques da semana</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="min-w-[280px] md:min-w-[360px] rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition">
            <img src="/img/banners/semana1.png" className="w-full h-40 object-cover" alt="" />
            <div className="p-4 font-semibold text-gray-900">Mostra de Cinema Independente</div>
          </div>
          <div className="min-w-[280px] md:min-w-[360px] rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition">
            <img src="/img/banners/semana2.webp" className="w-full h-40 object-cover" alt="" />
            <div className="p-4 font-semibold text-gray-900">Virada Cultural — Centro</div>
          </div>
          <div className="min-w-[280px] md:min-w-[360px] rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition">
            <img src="/img/banners/semana3.jpg" className="w-full h-40 object-cover" alt="" />
            <div className="p-4 font-semibold text-gray-900">Festival de Danças Urbanas</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900">Culture Hub</span>
            </div>
            <p className="text-gray-600">Descubra e compartilhe eventos culturais na sua cidade. Música, teatro, arte e muito mais, num só lugar.</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <img src="/img/social/instagram.png" alt="" width="16" height="16" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <img src="/img/social/facebook.png" alt="" width="16" height="16" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <img src="/img/social/twitter.png" alt="" width="16" height="16" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Categorias</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Música</a></li>
              <li><a href="#" className="hover:text-gray-900">Teatro</a></li>
              <li><a href="#" className="hover:text-gray-900">Cinema</a></li>
              <li><a href="#" className="hover:text-gray-900">Arte</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Sobre nós</a></li>
              <li><a href="#" className="hover:text-gray-900">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-gray-900">Fale conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Receba novidades</h4>
            <p className="text-gray-600 mb-3 text-sm">Eventos selecionados toda semana, direto no seu e-mail.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                Assinar
              </button>
            </div>
          </div>
        </div>

        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-between">
            <p>&copy; 2025 Culture Hub. Todos os direitos reservados.</p>
            <div className="flex items-center gap-3">
              <span>Brasil</span>
              <span className="mx-2 text-gray-300">•</span>
              <a href="#" className="hover:text-gray-700">Português (BR)</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home