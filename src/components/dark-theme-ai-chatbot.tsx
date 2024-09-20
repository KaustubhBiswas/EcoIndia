'use client'
//To do - change the bot avatar throwing errors and clear the console of errors.
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { useUser } from '@/contexts/usercontext'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Initial prompt to be sent with each user message
const INITIAL_PROMPT = process.env.NEXT_PUBLIC_INITIAL_PROMPT;

export function DarkThemeAiChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const {user, setUser} = useUser();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    //check if user data is stored in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser){
      setUser(JSON.parse(storedUser));  //set user state from local storage
    }
  },[setUser]);

  const [messages, setMessages] = useState([
    { role: 'model', content: `Hello ${user?.name}! I'm your AI assistant. How can I help you today?` }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // to fix never errors
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  interface Message {
    role: 'user' | 'model';
    content: string;
  }

  interface ApiResponse {
    candidates: { content: { parts: { text: string }[] } }[];
  }

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: INITIAL_PROMPT }] },
            ...messages.map(msg => ({ role: msg.role, parts: [{ text: msg.content }] })),
            { role: 'user', parts: [{ text: input }] }
          ]
        }),
      });

      const data: ApiResponse = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    }

    setIsLoading(false);
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --background: 220 20% 10%;
          --foreground: 220 10% 98%;
          --card: 220 20% 13%;
          --card-foreground: 220 10% 98%;
          --popover: 220 20% 13%;
          --popover-foreground: 220 10% 98%;
          --primary: 142 70% 50%;
          --primary-foreground: 220 10% 98%;
          --secondary: 220 20% 16%;
          --secondary-foreground: 220 10% 98%;
          --muted: 220 20% 16%;
          --muted-foreground: 220 10% 70%;
          --accent: 142 70% 50%;
          --accent-foreground: 220 10% 98%;
          --destructive: 0 62% 30%;
          --destructive-foreground: 220 10% 98%;
          --border: 220 20% 18%;
          --input: 220 20% 18%;
          --ring: 142 70% 50%;
        }
      `}</style>
<Button
  onClick={() => setIsOpen(!isOpen)}
  className="fixed bottom-8 right-8 rounded-full pt-6 pb-6 pr-2.5 pl-2.5 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out"
>
  <div className="flex items-center justify-center space-x-2">
    <MessageCircle className="h-8 w-8" />
  </div>
</Button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="fixed bottom-24 right-6 w-[440px] h-[600px] flex flex-col shadow-lg border-primary/20 bg-card text-card-foreground transition-all duration-300 ease-in-out animate-in slide-in-from-bottom-5">
            <CardHeader className="flex flex-row items-center justify-between bg-secondary rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Avatar className="bg-primary text-primary-foreground">
                  <AvatarImage src="/bot-avatar.png" alt="AI" />
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold text-primary">Eco Saathi</h2>
              </div>
              <Button onClick={() => setIsOpen(false)} size="icon" variant="ghost" className="text-primary hover:text-black">
                <X className="h-4 w-4 hover:text-black" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-4">
              <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                {messages.map((msg, index) => (
                  <div key={index} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                      <Avatar className={msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                        <AvatarFallback>{msg.role === 'user' ? <User /> : <Bot />}</AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-3 max-w-[75%] ${
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      } shadow-md transition-all duration-300 ease-in-out`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t border-primary/20">
              <form onSubmit={sendMessage} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="mt-3 flex-grow bg-secondary text-secondary-foreground placeholder-secondary-foreground/50 border-primary/20 focus:border-primary focus:ring-primary"
                />
                <Button type="submit" size="icon" disabled={isLoading} className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  )
}