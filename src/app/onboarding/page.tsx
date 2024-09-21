'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OnboardingPage() {
    const devUrl = process.env.NEXT_PUBLIC_DEV_URL;
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    latitude: '',
    longitude: '',
    events: [] as string[],
    usertype: 'User'
  })

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const jsonData = {
      name: formData.name,
      email: formData.email,
      number: formData.number,
      deflocation: {
        type: "Point",
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
      },
      regevents: formData.events,
      usertype: formData.usertype
    }

    try {
      const response = await fetch(`${devUrl}/users/createuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      })

      if (response.ok) {
        console.log('User onboarded successfully')
        router.replace('/dashboard')
      } else {
        const errorData = await response.json();
        console.error('Failed to onboard user:', errorData)
      }
    } catch (error) {
      console.error('Error during onboarding:', error)
    }
  }

  if (!isMounted) {
    return null; // Prevent server-side rendering from mismatch
  }

  return (
    <div className="min-h-screen bg-black flex items-center flex-col justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-black  rounded-lg shadow-xl border border-gray-400">
        <h1 className="text-3xl font-bold text-center text-white">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-gray-300">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              className="w-full bg-gray-800 text-white border-gray-700 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-gray-800 text-white border-gray-700 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="number" className="text-gray-300">Phone Number</Label>
            <Input
              id="number"
              name="number"
              type="tel"
              required
              className="w-full bg-gray-800 text-white border-gray-700 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
              value={formData.number}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude" className="text-gray-300">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="text"
                required
                className="w-full bg-gray-800 text-white border-gray-700 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
                value={formData.latitude}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="text-gray-300">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="text"
                required
                className="w-full bg-gray-800 text-white border-gray-700 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none"
                value={formData.longitude}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Complete Onboarding
          </Button>
        </form>
      </div>
      <footer className="text-center py-4 text-gray-500 text-sm mt-5">
        <p>Created by syntax_snipers</p>
      </footer>
    </div>
  )
}
