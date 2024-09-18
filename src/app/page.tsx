"use client";
import { useEffect } from "react";
import { useUser } from "@/contexts/usercontext";
import { useRouter } from "next/navigation";
import { DarkThemeAiChatbot } from "@/components/dark-theme-ai-chatbot";



export default function Home() {


  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    //check if user data is stored in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser){
      setUser(JSON.parse(storedUser));  //set user state from local storage
      router.replace('/dashboard');
    }
    else {
      //if no user is present in local storage, then redirect to sign in page
      router.replace('/signin');
    }
  }, [setUser, router]);


  return (
    <div>
      <h3>Home</h3>
      <DarkThemeAiChatbot />
    </div>
  )

}
