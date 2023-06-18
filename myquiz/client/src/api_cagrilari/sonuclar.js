const { default: axiosInstance } = require(".");

// sonuç ekle
export const addReport = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/reports/add-report", payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// tüm sonuçları al
export const getAllReports = async (filters) => {
    try {
        const response = await axiosInstance.post("/api/reports/get-all-reports" , filters);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
} 

// kullanıcı adına göre tüm sonuçları al
export const getAllReportsByUser = async () => {
    try {
        const response = await axiosInstance.post("/api/reports/get-all-reports-by-user");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}