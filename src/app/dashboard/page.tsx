'use client';


import { DarkThemeAiChatbot } from "@/components/dark-theme-ai-chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useUser } from "@/contexts/usercontext";
import { Bell, Calendar, ChevronDown, LogOut, Mail, Menu, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Image from 'next/image';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
]

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    //check if user data is stored in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser){
      setUser(JSON.parse(storedUser));  //set user state from local storage
    }
    else {
      //if no user is present in local storage, then redirect to sign in page
      router.replace('/signin');
    }
  }, [setUser, router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  function signOut(){
    if (window.google && window.google.accounts && window.google.accounts.id){
      window.google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/signin');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-black border-b border-white/10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <img src={user?.imageUrl || "/tree.jpg"} className="w-8 h-8 rounded-full" />
                <span>{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-[#2c2d2e] border-none shadow-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#00ff9d]">{user?.name}</h4>
                  <p className="text-sm text-gray-400">Pro Environmentalist</p>
                  <div className="flex items-center pt-2">
                    <Mail className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-gray-400">{user?.email}</span>
                  </div>
                  <div className="flex items-center pt-2">
                    <Calendar className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-gray-400">Joined December 2021</span>
                  </div>
                </div>
                <img src={user?.imageUrl || "/tree.jpg"} className="w-[50px] h-[50px] rounded-full" />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={signOut} >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Revenue', value: '$8,942.32', change: '+2.5%' },
            { title: 'Users', value: '56,271', change: '+3.2%' },
            { title: 'Conversion Rate', value: '8.5%', change: '+1.8%' }
          ].map((metric, index) => (
            <Card key={index} className="bg-black border-border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#00ff9d]">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{metric.value}</p>
                <p className="text-sm text-green-400">{metric.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card className="bg-black border-none shadow-lg p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#00ff9d]">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'black', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#00ff9d" strokeWidth={2} dot={{ fill: '#00ff9d' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" className="border-[#007aff] text-[#007aff] hover:bg-[#007aff] hover:text-white">
            Generate Report
          </Button>
          <Button variant="outline" className="border-[#007aff] text-[#007aff] hover:bg-[#007aff] hover:text-white">
            Export Data
          </Button>
        </div>
        <DarkThemeAiChatbot />
      </main>
    </div>
  )
}