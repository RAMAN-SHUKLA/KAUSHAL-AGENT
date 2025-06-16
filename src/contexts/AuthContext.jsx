import React, { createContext, useContext, useState } from 'react';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component
export function AuthProvider({ children }) {
    const [user] = useState({
        id: 'default-user',
        email: 'user@example.com',
        full_name: 'Default User',
        role: 'candidate',
        is_admin: false
    });
    const [isLoading] = useState(false);

    // The value provided to the context consumers
    const value = {
        user,
        isLoading,
        isAdmin: false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}