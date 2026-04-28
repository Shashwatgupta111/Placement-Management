import { loginAPI } from './api';

/**
 * Executes login workflow. Attempts to contact live backend first.
 */
export const loginUser = async (credentials) => {
  try {
    // 1. Attempt Live API Connection
    const response = await loginAPI(credentials);
    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Authentication system off-line.');
  }
};
