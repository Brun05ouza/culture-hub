import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Verificar usuário logado
    const userData = localStorage.getItem('user')
    const guestStatus = localStorage.getItem('isGuest')
    
    if (userData && guestStatus !== 'true') {
      setUser(JSON.parse(userData))
    }
    setIsGuest(guestStatus === 'true')

    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isGuest')
    setUser(null)
    setIsGuest(false)
    window.location.href = '/'
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container flex justify-between items-center py-4 relative">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Culture Hub
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Início
            </Link>
            <Link to="/meus-eventos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Meus Eventos
            </Link>
            <Link to="/criar-eventos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Eventos
            </Link>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Sobre Nós
            </a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              <div className="relative group">
                <img 
                  src={user.picture} 
                  alt="Perfil" 
                  className="w-8 h-8 rounded-full cursor-pointer" 
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Meu Perfil
                  </Link>
                  <Link to="/meus-eventos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Meus Eventos
                  </Link>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link to="/cadastro" className="btn-primary">
                Cadastre-se
              </Link>
            </div>
          )}
          
          {/* Botão menu mobile */}
          <button 
            className={`md:hidden hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        {/* Menu mobile */}
        <nav className={`md:hidden mobile-menu ${mobileMenuOpen ? 'show' : ''}`}>
          <Link to="/" className="text-gray-600 hover:text-blue-600 py-2">
            Início
          </Link>
          <Link to="/meus-eventos" className="text-gray-600 hover:text-blue-600 py-2">
            Meus Eventos
          </Link>
          <Link to="/criar-eventos" className="text-gray-600 hover:text-blue-600 py-2">
            Eventos
          </Link>
          <a href="#" className="text-gray-600 hover:text-blue-600 py-2">
            Sobre Nós
          </a>
          <div className="pt-4 border-t">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 py-2">
                  <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-sm text-gray-600">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 py-2"
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="block text-center py-2 border rounded-lg mb-2">
                  Login
                </Link>
                <Link to="/cadastro" className="block btn-primary text-center py-2 rounded-lg">
                  Cadastre-se
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header