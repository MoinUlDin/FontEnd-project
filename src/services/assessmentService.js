// src/services/assessmentService.js
import apiClient from "./apiClient";
import {
  setAssessments,
  deleteAssessment,
  setAssessmentDetail,
} from "../features/assessmentSlice";

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
  static async fetchAssessmentDetail(id, dispatch) {
    try {
      const response = await apiClient.get(`tests/test_instances/${id}/`);
      dispatch(setAssessmentDetail(response.data));
      return response;
    } catch (error) {
      throw error;
    }
  }
  static async createAssessment(payload, dispatch) {
    try {
      const response = await apiClient.post("tests/test_instances/", payload);
      await AssessmentService.fetchAssessments(dispatch);
      return response.data;
    } catch (error) {
      console.error("Error creating assessment:", error);
      throw error;
    }
  }
  static async deleteAssessment(id, dispatch) {
    try {
      const response = await apiClient.delete(`tests/test_instances/${id}/`);
      dispatch(deleteAssessment(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateAssessmentStatus(id, payload, dispatch) {
    try {
      console.log("payload:", payload);
      const response = await apiClient.patch(`tests/test_instances/${id}/`, {
        candidate_status: payload,
      });

      // Option 1: Update the entire assessments list:
      await AssessmentService.fetchAssessments(dispatch);
      // Option 2: Alternatively, if you have an update action in your reducer,
      // you can dispatch that here with the new data.
      return response.data;
    } catch (error) {
      console.error("Error updating assessment:", error);
      throw error;
    }
  }

  // You can add additional methods (create, update, delete) here as needed.
}

export default AssessmentService;
