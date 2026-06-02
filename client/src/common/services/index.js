import axiosInstance from "@/lib/axios";

// Add search and language parameters with empty defaults
export const getAllInterviews = async (search = "", language = "") => {
  try {
    // Build the query string dynamically
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (language) queryParams.append("language", language);

    // Send the request with the query string attached
    const url = queryParams.toString()
      ? `/interview?${queryParams.toString()}`
      : "/interview";

    const { status, data } = await axiosInstance.get(url);
    if (status === 200) {
      return data;
    }
  } catch (err) {
    console.error("Error fetching interviews:", err);
    return [];
  }
};
export const deleteInterview = async (roomId) => {
  try {
    await axiosInstance.delete(`/interview/${roomId}`);
    return true;
  } catch (err) {
    console.error("Error deleting room:", err);
    return false;
  }
};
