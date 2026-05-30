// import { axiosInstance } from "@lib/axios-instance.js";
// export const gatAllInterviews = async () => {
//   try {
//     const { status, data } = await axiosInstance.get("/interview");
//     if (status === 200) {
//       return data;
//     }
//   } catch (err) {
//     console.log(err);
//     return [];
//   }
// };
// src/common/services/index.js
import axiosInstance from "@/lib/axios"; // Your custom axios instance!

export const getAllInterviews = async () => {
  try {
    const { status, data } = await axiosInstance.get("/interview");
    if (status === 200) {
      return data;
    }
  } catch (err) {
    console.error("Error fetching interviews:", err);
    return [];
  }
};
