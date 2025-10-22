import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    // Simular delay de login
    setTimeout(() => {
      const userData = {
        name: formData.email.split('@')[0],
        email: formData.email,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.email.split('@')[0])}&background=3b82f6&color=fff`
      }
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.removeItem('isGuest')
      window.location.href = '/'
    }, 1000)
  }

  const handleGuestLogin = () => {
    localStorage.setItem('isGuest', 'true')
    window.location.href = '/'
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        background: `linear-gradient(135deg, rgba(2,6,23,.50), rgba(2,132,199,.30)), url('/img/fundo.jpg') center/cover no-repeat`
      }}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full mx-4">
        <div className="flex flex-col md:flex-row">
          {/* Lado esquerdo - Informações */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 md:w-1/2">
            <div className="mb-6">
              <span className="text-blue-200 text-sm font-medium">Volte ao que interessa</span>
              <h1 className="text-3xl font-bold mt-2">Bem-vindo de volta</h1>
              <p className="text-blue-100 mt-4">
                Entre para criar e acompanhar seus eventos favoritos. Você também pode continuar como convidado.
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <div>
                  <div className="font-semibold">Descubra eventos locais</div>
                  <div className="text-blue-200 text-sm">Achados perto de você, atualizados todo dia.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <div>
                  <div className="font-semibold">Crie e gerencie</div>
                  <div className="text-blue-200 text-sm">Publique, edite e acompanhe inscrições em tempo real.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <div>
                  <div className="font-semibold">Favoritos & alertas</div>
                  <div className="text-blue-200 text-sm">Salve artistas e receba lembretes antes do evento.</div>
                </div>
              </li>
            </ul>

            <div className="flex gap-6 mb-6">
              <div className="text-center">
                <div className="font-bold text-lg">12k+</div>
                <div className="text-blue-200 text-sm">usuários</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">1.4k</div>
                <div className="text-blue-200 text-sm">eventos/mês</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">4,8★</div>
                <div className="text-blue-200 text-sm">avaliação</div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center gap-3">
              <img src="/img/events/arte-bienal.webp" alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <span className="bg-green-400 text-green-900 px-2 py-1 rounded text-xs font-medium">Voltando hoje</span>
                <h3 className="font-semibold mt-1">Show no Centro</h3>
                <p className="text-blue-200 text-sm">Rio • 20:00</p>
              </div>
            </div>
          </div>

          {/* Lado direito - Formulário */}
          <div className="p-8 md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Entrar</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Senha</label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Esqueci a senha</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <button 
                type="button" 
                className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                Entrar com Google
              </button>

              <button 
                type="button" 
                onClick={handleGuestLogin}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
              >
                Continuar como convidado
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Não tem conta? <Link to="/cadastro" className="text-blue-600 hover:underline">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login