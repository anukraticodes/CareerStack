import API from "./axios";

export const loginUser = async (userId: string, password: string) => {
    const response = await API.post("/login", { userId, password });
    return response.data;
  };

export const registerUser = async (data: {
    name: string;
    email: string;
    userId: string;
    password: string;
  }) => {
    return await API.post("/register", data);
  };

  export const uploadUserFile = async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post(`/users/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };
  
  