"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Oops! Login Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The user ID or password you entered is incorrect. Please check your credentials and try again.
          </p>
          <div className="space-y-2">
            <Link href="/">
              <Button className="w-full">Try Again</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Create New Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
