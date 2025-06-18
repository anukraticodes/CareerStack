"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Mail, Lock, Sparkles, UserPlus, BadgeIcon as IdCard } from "lucide-react"

// Floating particles component for background
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userid: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { name, email, userid, password } = formData

    if (!name || !email || !userid || !password) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          userId: userid,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      // If registration is successful
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center py-8">
      <FloatingParticles />

      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-400/20 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-md p-4">
        {/* Welcome Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-bounce-slow">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2 animate-gradient-x">
            Join Us Today
          </h1>
          <p className="text-gray-300 text-lg">Create your account to get started</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border border-purple-500/20 shadow-2xl animate-fade-in-up animation-delay-200">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white">Register</CardTitle>
            <CardDescription className="text-gray-300">Create a new account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 animate-shake">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 font-medium">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="pl-12 bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 hover:bg-white/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="pl-12 bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 hover:bg-white/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userid" className="text-gray-300 font-medium">
                  User ID
                </Label>
                <div className="relative group">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  <Input
                    id="userid"
                    name="userid"
                    type="text"
                    value={formData.userid}
                    onChange={handleInputChange}
                    placeholder="Choose a unique user ID"
                    required
                    className="pl-12 bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 hover:bg-white/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Choose a strong password"
                    required
                    className="pl-12 pr-12 bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 hover:bg-white/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">Already have an account?</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-300">
                <Link
                  href="/"
                  className="text-purple-400 hover:text-pink-400 font-medium transition-colors duration-300 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in-up animation-delay-400">
          <p className="text-gray-400 text-sm">Secure • Fast • Reliable</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>
    </div>
  )
}
