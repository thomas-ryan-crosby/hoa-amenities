import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface Community {
  id: number;
  name: string;
  description?: string;
  role: 'resident' | 'janitorial' | 'admin';
  joinedAt?: string;
  isCurrent?: boolean;
  accessCode?: string;
  onboardingCompleted?: boolean;
  authorizationCertified?: boolean;
  paymentSetup?: boolean;
  memberListUploaded?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  currentCommunity: Community | null;
  communities: Community[];
  login: (user: User, token: string, communities: Community[], currentCommunity: Community) => void;
  switchCommunity: (communityId: number) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isJanitorial: boolean;
  isResident: boolean;
  refreshCommunities: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);

  const refreshCommunities = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const currentToken = token || localStorage.getItem('token');
      
      if (!currentToken) return;

      const response = await axios.get(`${apiUrl}/api/communities`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      const fetchedCommunities = response.data.communities.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        role: c.role,
        joinedAt: c.joinedAt,
        isCurrent: c.isCurrent,
        accessCode: c.accessCode,
        onboardingCompleted: c.onboardingCompleted,
        authorizationCertified: c.authorizationCertified,
        paymentSetup: c.paymentSetup,
        memberListUploaded: c.memberListUploaded
      }));

      setCommunities(fetchedCommunities);
      
      const current = fetchedCommunities.find((c: Community) => c.isCurrent) || fetchedCommunities[0];
      if (current) {
        setCurrentCommunity(current);
        localStorage.setItem('currentCommunity', JSON.stringify(current));
      }
      
      localStorage.setItem('communities', JSON.stringify(fetchedCommunities));
    } catch (error) {
      console.error('Error refreshing communities:', error);
    }
  };

  useEffect(() => {
    // Check for stored authentication data on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedCurrentCommunity = localStorage.getItem('currentCommunity');
    const storedCommunities = localStorage.getItem('communities');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      if (storedCurrentCommunity) {
        setCurrentCommunity(JSON.parse(storedCurrentCommunity));
      }
      
      if (storedCommunities) {
        setCommunities(JSON.parse(storedCommunities));
      } else if (storedToken) {
        // If we have a token but no communities, fetch them
        const fetchCommunities = async () => {
          try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${apiUrl}/api/communities`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });

            const fetchedCommunities = response.data.communities.map((c: any) => ({
              id: c.id,
              name: c.name,
              description: c.description,
              role: c.role,
              joinedAt: c.joinedAt,
              isCurrent: c.isCurrent,
              accessCode: c.accessCode,
              onboardingCompleted: c.onboardingCompleted,
              authorizationCertified: c.authorizationCertified,
              paymentSetup: c.paymentSetup,
              memberListUploaded: c.memberListUploaded
            }));

            setCommunities(fetchedCommunities);
            
            const current = fetchedCommunities.find((c: Community) => c.isCurrent) || fetchedCommunities[0];
            if (current) {
              setCurrentCommunity(current);
              localStorage.setItem('currentCommunity', JSON.stringify(current));
            }
            
            localStorage.setItem('communities', JSON.stringify(fetchedCommunities));
          } catch (error) {
            console.error('Error fetching communities:', error);
          }
        };
        fetchCommunities();
      }
    }
  }, []);

  const login = (userData: User, userToken: string, communitiesData: Community[], currentCommunityData: Community) => {
    setUser(userData);
    setToken(userToken);
    setCommunities(communitiesData);
    setCurrentCommunity(currentCommunityData);
    
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('communities', JSON.stringify(communitiesData));
    localStorage.setItem('currentCommunity', JSON.stringify(currentCommunityData));
  };

  const switchCommunity = async (communityId: number) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const currentToken = token || localStorage.getItem('token');
      
      if (!currentToken) {
        throw new Error('Not authenticated');
      }

      const response = await axios.post(
        `${apiUrl}/api/communities/${communityId}/switch`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        }
      );

      const newToken = response.data.token;
      const newCurrentCommunity = response.data.currentCommunity;

      setToken(newToken);
      setCurrentCommunity(newCurrentCommunity);
      
      // Update communities list to mark current
      const updatedCommunities = communities.map(c => ({
        ...c,
        isCurrent: c.id === communityId
      }));
      setCommunities(updatedCommunities);

      localStorage.setItem('token', newToken);
      localStorage.setItem('currentCommunity', JSON.stringify(newCurrentCommunity));
      localStorage.setItem('communities', JSON.stringify(updatedCommunities));

      // Reload the page to refresh all data with new community context
      window.location.reload();
    } catch (error: any) {
      console.error('Error switching community:', error);
      throw new Error(error.response?.data?.message || 'Failed to switch community');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrentCommunity(null);
    setCommunities([]);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentCommunity');
    localStorage.removeItem('communities');
  };

  const isAuthenticated = !!user && !!token && !!currentCommunity;
  const isAdmin = currentCommunity?.role === 'admin';
  const isJanitorial = currentCommunity?.role === 'janitorial' || currentCommunity?.role === 'admin';
  const isResident = currentCommunity?.role === 'resident' || currentCommunity?.role === 'janitorial' || currentCommunity?.role === 'admin';

  const value: AuthContextType = {
    user,
    token,
    currentCommunity,
    communities,
    login,
    switchCommunity,
    logout,
    isAuthenticated,
    isAdmin,
    isJanitorial,
    isResident,
    refreshCommunities
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
