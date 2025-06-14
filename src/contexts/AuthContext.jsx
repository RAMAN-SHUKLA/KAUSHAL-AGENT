import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';

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
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch or create a user profile
    const fetchOrCreateProfile = useCallback(async (userData) => {
        if (!userData) return null;

        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userData.id)
                .single();

            if (error && error.code === 'PGRST116') { // Profile not found
                console.log('Creating new profile for user:', userData.id);
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: userData.id,
                        email: userData.email,
                        full_name: userData.email?.split('@')[0] || 'New User',
                        role: 'candidate',
                        is_admin: false
                    }])
                    .select()
                    .single();

                if (createError) throw createError;
                return { ...userData, ...newProfile };
            }

            if (error) throw error;
            return { ...userData, ...profile };
        } catch (error) {
            console.error('Error in fetchOrCreateProfile:', error);
            toast.error('Failed to get user profile.');
            return { ...userData, role: 'candidate', is_admin: false }; // Return basic user data
        }
    }, []);

    // Effect to handle auth state changes
    useEffect(() => {
        setIsLoading(true);
        // Check for initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const userProfile = await fetchOrCreateProfile(session.user);
                setUser(userProfile);
                setSession(session);
            }
            setIsLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(`Auth event: ${event}`);
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setSession(null);
                } else if (session?.user) {
                    const userProfile = await fetchOrCreateProfile(session.user);
                    setUser(userProfile);
                    setSession(session);
                }
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription?.unsubscribe();
        };
    }, [fetchOrCreateProfile]);

    // Sign-in function
    const signIn = useCallback(async (email, password) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            // The onAuthStateChange listener will handle setting user and session
            return { data };
        } catch (error) {
            console.error('Sign in error:', error);
            toast.error(error.message || 'Failed to sign in.');
            return { error };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Sign-up function
    const signUp = useCallback(async (email, password, metadata) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: metadata?.fullName || email.split('@')[0],
                        role: metadata?.isAdmin ? 'admin' : 'candidate',
                        is_admin: metadata?.isAdmin || false,
                    },
                },
            });
            
            if (error) {
                // Handle specific error for already registered user
                if (error.message.includes('User already registered')) {
                     toast.warning('This email is already registered. Please log in.');
                } else {
                    throw error;
                }
            }
            
            if (data.user) {
                // Create or update the user profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        email: data.user.email,
                        full_name: metadata?.fullName || data.user.email.split('@')[0],
                        role: metadata?.isAdmin ? 'admin' : 'candidate',
                        is_admin: metadata?.isAdmin || false,
                        updated_at: new Date().toISOString(),
                    });

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                }

                toast.success('Account created successfully! Please sign in.');
            }
            return { data, error };
        } catch (error) {
            console.error('Sign up error:', error);
            toast.error(error.message || 'Failed to sign up.');
            return { error };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Sign-out function
    const signOut = useCallback(async () => {
        setIsLoading(true);
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
            toast.error('Failed to sign out.');
        } finally {
            // The onAuthStateChange listener will clear user and session
            setIsLoading(false);
        }
    }, []);

    // The value provided to the context consumers
    const value = {
        session,
        user,
        isLoading,
        signIn,
        signOut,
        signUp,
        isAdmin: user?.is_admin || false,
    };

    return (
        <AuthContext.Provider value={value}>
            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}