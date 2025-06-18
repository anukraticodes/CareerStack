"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { FileBadge, FileSignature, File } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileText,
  Award,
  Mail,
  ImageIcon,
  Download,
  Trash2,
  Eye,
  Plus,
  Clock,
  Star,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react"
import type { FileItem } from "@/lib/types/file"

const categoryIcons = {
  Resume: FileText,
  Certificate: Award,
  "Cover Letter": Mail,
  Other: ImageIcon,
  "Auto Detect": Search,
}

const categoryColors = {
  Resume: "bg-blue-500",
  Certificate: "bg-green-500",
  "Cover Letter": "bg-purple-500",
  Other: "bg-gray-500",
  "Auto Detect": "bg-orange-500",
}

export const FileIcons = {
  Resume: FileText,
  Certificate: FileBadge,
  "Cover Letter": FileSignature,
  Other: File,
  "Auto Detect": Search,
} as const

// Floating particles component for background
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
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

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Resume")
  const [filterCategory, setFilterCategory] = useState("all")
  const [uploadMessage, setUploadMessage] = useState("")
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [shareLinks, setShareLinks] = useState<{ [fileId: string]: string }>({})
  const [shareErrors, setShareErrors] = useState<{ [fileId: string]: string }>({})

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return router.push("/")
    setUser(JSON.parse(currentUser))
  }, [router])

  const detectCategory = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Detection failed")

      const data = await res.json()

      const raw = data.category || "unknown"

      const formatted =
        raw.toLowerCase() === "unknown" ? "Other" : raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()

      return formatted
    } catch (err) {
      console.error("Auto-detection error:", err)
      return "Other"
    }
  }

  const handleUpload = async (file: File) => {
    if (!user) return

    setIsUploading(true)
    let categoryToUse = selectedCategory
    if (selectedCategory === "Auto Detect") {
      categoryToUse = await detectCategory(file)
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("category", categoryToUse)

    try {
      const res = await fetch(`http://localhost:8080/api/users/upload/${user.userId}`, {
        method: "POST",
        body: formData,
      })
      const result = await res.text()
      setUploadMessage(result)

      const existingFile = files.find((f) => f.name === file.name && f.category === categoryToUse)
      const version = existingFile ? existingFile.version + 1 : 1

      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        category: categoryToUse as FileItem["category"],
        uploadDate: new Date(),
        version,
        url: URL.createObjectURL(file),
        isStarred: false,
      }

      setFiles((prev) => [...prev, newFile])
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      setUploadMessage("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handleUpload)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(handleUpload)
    }
  }

  const deleteFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))
  const toggleStar = (id: string) =>
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isStarred: !f.isStarred } : f)))
  const downloadFile = (file: FileItem) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    link.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]
  }

  const getVersionHistory = (name: string, cat: string) =>
    files.filter((f) => f.name === name && f.category === cat).sort((a, b) => b.version - a.version)

  const filteredFiles = filterCategory === "all" ? files : files.filter((f) => f.category === filterCategory)
  const categories = ["all", "Resume", "Certificate", "Cover Letter", "Other"]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleShare = async (fileId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/files/share/${fileId}`, {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to generate share link")

      const data = await res.json()
      const link = data.shareableLink

      setShareLinks((prev) => ({ ...prev, [fileId]: link }))
      setShareErrors((prev) => ({ ...prev, [fileId]: "" }))
    } catch (err) {
      setShareErrors((prev) => ({ ...prev, [fileId]: "Failed to generate share link." }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingParticles />

      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-400/20 via-transparent to-transparent"></div>

      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Success notification */}
          {showSuccess && (
            <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
                <div className="animate-bounce">✅</div>
                <span>File uploaded successfully!</span>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
              <div></div>
              <Button
                onClick={handleLogout}
                className="bg-red-500/80 backdrop-blur-sm hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg border border-red-400/30"
              >
                Logout
              </Button>
            </div>

            <div className="text-center mt-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4 animate-gradient-x">
                ✨ Smart File Manager
              </h1>
              <p className="text-gray-300 text-lg animate-fade-in-up animation-delay-200">
                Upload, organize, and manage your documents with elegance
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <Card className="mb-8 border border-purple-500/30 bg-white/5 backdrop-blur-xl shadow-2xl animate-fade-in-up animation-delay-300">
            <CardContent className="p-8">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 ${
                  dragActive
                    ? "border-purple-400 bg-purple-500/10 scale-105 shadow-2xl shadow-purple-500/25"
                    : "border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-500/5"
                } ${isUploading ? "animate-pulse" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div
                    className={`p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg transition-all duration-300 ${dragActive ? "animate-bounce" : "hover:scale-110"}`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-10 w-10 text-white animate-spin" />
                    ) : (
                      <Upload className="h-10 w-10 text-white" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {isUploading ? "Uploading..." : "Drop your files here or click to browse"}
                    </h3>
                    <p className="text-gray-300">Support for PDF, DOC, DOCX, JPG, PNG files</p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-300">
                        Category
                      </Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48 bg-white/10 border-purple-500/30 text-white backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-purple-500/30">
                          <SelectItem value="Auto Detect" className="text-white hover:bg-purple-500/20">
                            🔍 Auto Detect
                          </SelectItem>
                          <SelectItem value="Resume" className="text-white hover:bg-blue-500/20">
                            📄 Resume
                          </SelectItem>
                          <SelectItem value="Certificate" className="text-white hover:bg-green-500/20">
                            🏆 Certificate
                          </SelectItem>
                          <SelectItem value="Cover Letter" className="text-white hover:bg-purple-500/20">
                            ✉️ Cover Letter
                          </SelectItem>
                          <SelectItem value="Other" className="text-white hover:bg-gray-500/20">
                            📁 Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-50"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
            </CardContent>
          </Card>

          {/* Filter Tabs */}
          <Tabs
            value={filterCategory}
            onValueChange={setFilterCategory}
            className="mb-8 animate-fade-in-up animation-delay-400"
          >
            <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-xl">
              {categories.map((category, index) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-300 hover:text-white"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {category === "all"
                    ? "🗂️ All Files"
                    : `${category === "Resume" ? "📄" : category === "Certificate" ? "🏆" : category === "Cover Letter" ? "✉️" : "📁"} ${category}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Files Grid */}
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredFiles.map((file, index) => {
                const IconComponent = FileIcons[file.category] || File
                const versions = getVersionHistory(file.name, file.category)

                return (
                  <Card
                    key={file.id}
                    className="group hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 bg-white/5 backdrop-blur-xl border border-purple-500/20 shadow-xl animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div
                          className={`p-3 rounded-xl ${categoryColors[file.category]} bg-opacity-20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                        >
                          <IconComponent className="h-7 w-7 text-white" />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStar(file.id)}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125"
                        >
                          <Star
                            className={`h-5 w-5 transition-all duration-300 ${
                              file.isStarred
                                ? "fill-yellow-400 text-yellow-400 animate-pulse"
                                : "text-gray-400 hover:text-yellow-400"
                            }`}
                          />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <CardTitle className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors duration-300">
                          {file.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={`${categoryColors[file.category]} text-white text-xs shadow-lg transition-all duration-300 group-hover:scale-105`}
                          >
                            {file.category}
                          </Badge>
                          {versions.length > 1 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-purple-400 text-purple-300 animate-pulse"
                            >
                              v{file.version}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3 text-xs text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-purple-400" />
                          <span>{file.uploadDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span>Size: {formatFileSize(file.size)}</span>
                        </div>
                        {versions.length > 1 && (
                          <div className="text-purple-400 font-medium animate-pulse">
                            {versions.length} versions available
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-6">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 border-blue-400/50 text-blue-100 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105"
                              onClick={() => setPreviewFile(file)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto bg-slate-900/95 backdrop-blur-xl border-purple-500/30">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2 text-white">
                                <IconComponent className="h-5 w-5" />
                                <span>{file.name}</span>
                                <Badge className={`${categoryColors[file.category]} text-white`}>{file.category}</Badge>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={file.url || "/placeholder.svg"}
                                  alt={file.name}
                                  className="max-w-full h-auto rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
                                />
                              ) : file.type === "application/pdf" ? (
                                <iframe
                                  src={file.url}
                                  className="w-full h-96 rounded-xl border border-purple-500/30 shadow-xl"
                                  title={file.name}
                                />
                              ) : (
                                <div className="text-center py-12">
                                  <FileText className="h-20 w-20 mx-auto text-gray-400 mb-6 animate-pulse" />
                                  <p className="text-gray-300 text-lg mb-6">Preview not available for this file type</p>
                                  <Button
                                    onClick={() => downloadFile(file)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download to View
                                  </Button>
                                </div>
                              )}

                              {versions.length > 1 && (
                                <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/20">
                                  <h4 className="font-semibold text-white mb-4 flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-purple-400" />
                                    Version History
                                  </h4>
                                  <div className="space-y-3">
                                    {versions.map((version, index) => (
                                      <div
                                        key={version.id}
                                        className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <Badge
                                            variant={index === 0 ? "default" : "secondary"}
                                            className="animate-pulse"
                                          >
                                            v{version.version}
                                          </Badge>
                                          <span className="text-gray-300">
                                            {version.uploadDate.toLocaleDateString()}
                                          </span>
                                          {index === 0 && (
                                            <Badge
                                              variant="outline"
                                              className="text-green-400 border-green-400 animate-pulse"
                                            >
                                              Latest
                                            </Badge>
                                          )}
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => downloadFile(version)}
                                          className="hover:bg-green-500/20 transition-all duration-300 hover:scale-110"
                                        >
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(file)}
                          className="bg-green-500/20 hover:bg-green-500/40 border-green-400/50 text-green-100 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105"
                        >
                          <Download className="h-3 w-3" />
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleShare(file.id)}
                          className="bg-blue-500/60 hover:bg-blue-500/80 text-white border border-blue-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                          Share
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFile(file.id)}
                          className="bg-red-500/20 hover:bg-red-500/40 border-red-400/50 text-red-100 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {shareLinks[file.id] && (
                        <div className="mt-4 p-3 bg-green-500/20 text-green-300 rounded-lg text-sm backdrop-blur-sm border border-green-500/30 animate-fade-in">
                          Shareable Link:
                          <a
                            href={shareLinks[file.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline ml-1 hover:text-blue-300 transition-colors duration-300"
                          >
                            {shareLinks[file.id]}
                          </a>
                        </div>
                      )}

                      {shareErrors[file.id] && (
                        <div className="mt-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm backdrop-blur-sm border border-red-500/30 animate-fade-in">
                          {shareErrors[file.id]}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-16 bg-white/5 backdrop-blur-xl border border-purple-500/20 shadow-2xl animate-fade-in-up">
              <CardContent>
                <div className="text-8xl mb-6 animate-bounce">📁</div>
                <h3 className="text-2xl font-semibold text-white mb-4">No files yet</h3>
                <p className="text-gray-300 text-lg">Upload your first file to get started!</p>
              </CardContent>
            </Card>
          )}

          {/* Stats Footer */}
          {files.length > 0 && (
            <Card className="mt-12 bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-xl border border-purple-400/30 shadow-2xl animate-fade-in-up animation-delay-600">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {[
                    { label: "Total Files", value: files.length, delay: "0ms" },
                    { label: "Resumes", value: files.filter((f) => f.category === "Resume").length, delay: "100ms" },
                    {
                      label: "Certificates",
                      value: files.filter((f) => f.category === "Certificate").length,
                      delay: "200ms",
                    },
                    { label: "Starred", value: files.filter((f) => f.isStarred).length, delay: "300ms" },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className="animate-fade-in-up hover:scale-110 transition-all duration-300"
                      style={{ animationDelay: stat.delay }}
                    >
                      <div className="text-4xl font-bold text-white mb-2 animate-pulse">{stat.value}</div>
                      <div className="text-sm text-purple-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
      `}</style>
    </div>
  )
}

