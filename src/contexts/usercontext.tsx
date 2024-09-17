"use client"

import { createContext, ReactNode, useContext, useState } from 'react';

interface User {
    name: string;
    email: string;
    imageUrl: string;
}

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value = {{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);