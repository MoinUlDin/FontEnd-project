import apiClient from "./apiClient";
import { setTemplates, setDetailedTemplate } from "../features/templateSlice";

class TempService {
  static async fetchTemplates(dispatch) {
    try {
      const response = await apiClient.get("tests/templates/");
      dispatch(setTemplates(response.data)); // Update Redux store
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  }

  static async createTemplate(data, dispatch) {
    try {
      const response = await apiClient.post("tests/templates/", data);
      return response.datq;
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  }

  static async fetchTemplatedetail(id = "", dispatch) {
    try {
      const response = await apiClient.get(`tests/templates/${id}`);
      dispatch(setDetailedTemplate(response.data));
    } catch (error) {
      console.error("Error fetching detail template:", error);
      throw error;
    }
  }
  static async postTemplate(data, dispatch) {
    try {
      const response = await apiClient.post(`tests/edit_template/`, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching detail template:", error);
      throw error;
    }
  }
  static async deleteTemplate(id) {
    try {
      const endpoint = `tests/templates/${id}/`;
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  }
}

export default TempService;
