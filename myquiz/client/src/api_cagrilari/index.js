import axios from 'axios';

// Axios instance oluşturulur ve Authorization başlığına token eklenir
const axiosInstance = axios.create({
    headers: {
         Authorization : `Bearer ${localStorage.getItem('token')}`
    }
});

export default axiosInstance;