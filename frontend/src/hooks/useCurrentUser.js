import { useState, useEffect } from 'react';
import { fetchStudentProfile } from '../services/studentService';

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const studentId = localStorage.getItem('studentId');
      const userStr = localStorage.getItem('user');

      let userData = null;
      if (userStr) {
        try {
          userData = JSON.parse(userStr);
        } catch (e) {
          console.error('Failed to parse user data from localStorage');
        }
      }

      setUser(userData);

      // Load student profile if user is a student
      if (userRole === 'student' && studentId && studentId !== 'null') {
        fetchStudentProfile(studentId)
          .then(profileData => {
            setProfile(profileData);
          })
          .catch(error => {
            console.error('Failed to fetch student profile:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const getDisplayName = () => {
    if (!user) return 'User';
    
    if (user.role === 'student' && profile) {
      return profile.fullName || user.name || 'Student';
    }
    
    return user.name || user.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const getRoleDisplay = () => {
    if (!user) return 'User';
    
    const roleMap = {
      'student': 'Student',
      'admin': 'Admin',
      'coordinator': 'Coordinator'
    };
    
    return roleMap[user.role] || 'User';
  };

  const getAvatarColor = () => {
    if (!user) return 'gray';
    
    const colorMap = {
      'student': 'blue',
      'admin': 'purple',
      'coordinator': 'indigo'
    };
    
    return colorMap[user.role] || 'gray';
  };

  return {
    user,
    profile,
    loading,
    displayName: getDisplayName(),
    initials: getInitials(),
    roleDisplay: getRoleDisplay(),
    avatarColor: getAvatarColor()
  };
};
