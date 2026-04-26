const API_BASE_URL = "http://localhost:8000/api/uploads";

const UploadService = {
  validateExcelUpload: async (file: File): Promise<any> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: "POST",
      body: formData,
      // IMPORTANT: Do NOT add "Content-Type" headers here.
      // FormData handles it automatically.
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Upload failed with status: ${response.status}`,
      );
    }

    return response.json();
  },
};

export default UploadService;
