"use client";
import { useUser } from '@/contexts/usercontext';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


//client_ID of the google project
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function SignIn() {

  const {setUser} = useUser();
  const router = useRouter();

  useEffect(() => {
    //Load the Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function initializeGoogleSignIn() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('gsi-button') as HTMLElement,
        { theme: 'outline', size: 'large'}
      );
    } else {
      console.error('Google API not loaded');
    }
  }

  function handleCredentialResponse(response: any){
    const decodedUser: any = jwtDecode(response.credential);

    //saving the user data in the local storage
    localStorage.setItem(
      'user',
      JSON.stringify({
        name: decodedUser.name,
        email: decodedUser.email,
        imageUrl: decodedUser.picture,
      })
    );


    setUser({
        name: decodedUser.name,
        email: decodedUser.email,
        imageUrl: decodedUser.picture,
    });
    console.log('Logged in as:', decodedUser.name);
    console.log('User email: ',decodedUser.email);
    router.replace('/dashboard');
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        {(
          <div className="text-center">
            <img
              className="w-20 h-20 mx-auto rounded-full"
            />
            <h2 className="mt-4 text-xl font-bold"></h2>
            <p className="text-gray-600"></p>
          </div>
        )} : {(
          <div id="gsi-button"></div> // This will display the Google Sign-In button
        )}
      </div>
    </div>
  );

}
