import { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface User {
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (updatedUser: { username: string; email: string }) => Promise<void>;
    deleteUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null; 
        }
    });

    const login = async (email: string, password: string) => {
        try {
            const { data } = await axios.post('https://capstone-backend-cuha.onrender.com/login', { email, password });
            const token = data.access_token;
            localStorage.setItem('token', token);
            const loggedInUser: User = { username: data.username, email };
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
        } catch (error) {
            console.error('Login failed:', error);
            throw error; 
        }
    };

    const register = async (username: string, email: string, password: string) => {
        await axios.post('https://capstone-backend-cuha.onrender.com/register', { username, email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = async (updatedUser: { username: string; email: string }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('https://capstone-backend-cuha.onrender.com/update_account', updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    const deleteUser = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete('https://capstone-backend-cuha.onrender.com/delete_account', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            logout();
            alert('Account deleted successfully');
        } catch (error) {
            console.error('Failed to delete account', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
