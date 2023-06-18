const { default: axiosInstance } = require(".");

//kullanıcı kayıt
export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/kayit', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// Kullanıcı girişi
export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/giris', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// Kullanıcı bilgilerini alma
export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post('/api/users/get-user-info');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
