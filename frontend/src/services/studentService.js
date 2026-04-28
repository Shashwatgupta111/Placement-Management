// src/services/studentService.js

/**
 * Service to handle student profile API requests.
 */

const isMongoObjectId = (value) => typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value);

export const saveStudentProfile = async (profileData) => {
  try {
    const response = await fetch("/api/students/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`API Error: Received invalid response from server (Status ${response.status}). Check if backend is running on the correct port.`);
    }

    if (!response.ok) {
      const errorMessage = data.error ? `${data.message} (${data.error})` : data.message;
      throw new Error(errorMessage || "Something went wrong while saving the profile.");
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the backend server. Please ensure it is running.");
    }
    throw error;
  }
};

/**
 * Fetch an existing student profile by ID
 */
export const fetchStudentProfile = async (id) => {
  if (!isMongoObjectId(id)) return null;
  try {
    const response = await fetch(`/api/students/profile/${id}`);
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`API Error: Received invalid response from server (Status ${response.status}).`);
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch student profile.");
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the backend server.");
    }
    throw error;
  }
};

/**
 * Update an existing student profile
 */
export const updateStudentProfile = async (id, profileData) => {
  if (!isMongoObjectId(id)) {
    throw new Error("Invalid student id. Please re-login or recreate the student profile.");
  }
  try {
    const response = await fetch(`/api/students/profile/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`API Error: Received invalid response from server (Status ${response.status}).`);
    }

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong while updating the profile.");
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the backend server.");
    }
    throw error;
  }
};
