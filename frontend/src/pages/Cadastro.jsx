import { useState } from 'react'
import { Link } from 'react-router-dom'

function Cadastro() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Preencha todos os campos')
      return
    }

    if (formData.name.length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (!formData.terms) {
      setError('Você deve aceitar os termos de uso')
      return
    }

    // Simular cadastro
    const userData = {
      name: formData.name,
      email: formData.email,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3b82f6&color=fff`
    }
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.removeItem('isGuest')
    window.location.href = '/'
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        background: `linear-gradient(135deg, rgba(2,6,23,.45), rgba(2,132,199,.25)), url('/img/fundo.jpg') center/cover no-repeat`
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Criar conta</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seu nome"
              required
            />
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mín. 6 caracteres"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Repita a senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.checked})}
              className="mr-2"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Aceito os <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a>
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button type="submit" className="w-full btn-primary">
            Criar conta
          </button>

          <div className="text-center">
            <span className="text-gray-500">ou</span>
          </div>

          <button type="button" className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Cadastrar com Google
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem conta? <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link>
        </p>
      </div>
    </main>
  )
}

export default Cadastro