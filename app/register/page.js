"use client"

import Link from "next/link"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/auth"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = useCallback(() => {
    const newErrors = {}
    const { username, password, confirmPassword } = formData

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username tidak boleh kosong"
    } else if (username.length < 3) {
      newErrors.username = "Username minimal 3 karakter"
    } else if (username.length > 50) {
      newErrors.username = "Username maksimal 50 karakter"
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username hanya boleh berisi huruf, angka, dan underscore"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password tidak boleh kosong"
    } else if (password.length < 4) {
      newErrors.password = "Password minimal 4 karakter"
    } else if (password.length > 100) {
      newErrors.password = "Password maksimal 100 karakter"
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password dan konfirmasi password tidak sama"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const handleRegister = useCallback(async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      await registerUser({ 
        username: formData.username.trim(), 
        password: formData.password 
      })
      
      // Show success message before redirect
      const successMessage = "Registrasi berhasil! Silakan login."
      console.info(successMessage)
      
      router.push("/login?registered=true")
    } catch (error) {
      console.error("Registration error:", error)
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Registrasi gagal. Silakan coba lagi."
      
      setErrors({ general: errorMessage })
    } finally {
      setLoading(false)
    }
  }, [formData, validateForm, router])

  const getPasswordStrength = useCallback(() => {
    const { password } = formData
    let score = 0
    
    if (!password) return { score: 0, label: "", color: "bg-gray-200" }
    
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/(?=.*[a-z])/.test(password)) score++
    if (/(?=.*[A-Z])/.test(password)) score++
    if (/(?=.*[0-9])/.test(password)) score++
    if (/(?=.*[!@#$%^&*])/.test(password)) score++
    
    if (score <= 2) return { score, label: "Lemah", color: "bg-red-500" }
    if (score <= 4) return { score, label: "Sedang", color: "bg-yellow-500" }
    return { score, label: "Kuat", color: "bg-green-500" }
  }, [formData])

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side - Registration Form */}
        <div className="p-8 md:p-12 order-2 lg:order-1">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#004D4D] rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Buat Akun Baru
              </h1>
              <p className="text-slate-500 text-sm">
                Daftar untuk melaporkan dan memantau pengaduan masyarakat
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-5">
              {/* General Error Alert */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={handleInputChange}
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? "username-error" : undefined}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      errors.username ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-[#004D4D]'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-slate-50`}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.username && (
                  <p id="username-error" className="mt-1 text-xs text-red-600">
                    {errors.username}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Minimal 3 karakter, hanya huruf, angka, dan underscore
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleInputChange}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-[#004D4D]'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-slate-50`}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-xs text-red-600">
                    {errors.password}
                  </p>
                )}
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex gap-1 flex-1 mr-2">
                        {[1, 2, 3, 4, 5, 6].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              level <= passwordStrength.score 
                                ? passwordStrength.color 
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.color === 'bg-red-500' ? 'text-red-600' :
                        passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Gunakan minimal 4 karakter dengan kombinasi huruf besar, huruf kecil, dan angka
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ketik ulang password Anda"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-[#004D4D]'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-slate-50`}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#004D4D] hover:bg-[#006666] text-white py-2.5 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#004D4D] focus:ring-offset-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-600 text-sm">
                Sudah memiliki akun?{" "}
                <Link 
                  href="/login" 
                  className="text-[#004D4D] font-semibold hover:text-[#006666] transition hover:underline"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration & Benefits */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#004D4D] to-[#006666] p-12 order-1 lg:order-2">
          <div className="text-center">
            <div className="mb-8">
              <Image
                src="/user-profile.png"
                alt="Register Illustration"
                width={320}
                height={320}
                className="object-contain mx-auto"
                priority
              />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Sistem Pengaduan Masyarakat
            </h2>
            <p className="text-white/80 text-sm mb-8">
              Platform resmi untuk menyampaikan aspirasi dan pengaduan
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3 text-white/90">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Laporkan masalah dengan mudah dan cepat</span>
              </div>
              <div className="flex items-start gap-3 text-white/90">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Pantau status pengaduan Anda secara real-time</span>
              </div>
              <div className="flex items-start gap-3 text-white/90">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Dapatkan tanggapan dari pihak berwenang</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}