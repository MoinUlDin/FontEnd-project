// src/services/assessmentService.js
import apiClient from "./apiClient";
import { setAssessments } from "../features/assessmentSlice";
class AssessmentService {
  static async fetchAssessments(dispatch) {
    try {
      const response = await apiClient.get("tests/test_instances/");
      // Assuming the API returns an array of test instance objects.
      dispatch(setAssessments(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching assessments:", error);
      throw error;
    }
  }
  static async createAssessment(payload, dispatch) {
    try {
      const response = await apiClient.post("tests/test_instances/", payload);
      // Optionally, if your API returns the updated list, dispatch it:
      // dispatch(setAssessments(response.data));
      return response.data;
    } catch (error) {
      console.error("Error creating assessment:", error);
      throw error;
    }
  }

  // You can add additional methods (create, update, delete) here as needed.
}

export default AssessmentService;
