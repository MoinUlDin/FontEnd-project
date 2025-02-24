import apiClient from "./apiClient";
import { setTemplates } from "../features/templateSlice";

class TemplatesService {
  static async fetchTemplates(dispatch) {
    try {
      const response = await apiClient.get("tests/templates/");
      dispatch(setTemplates(response.data)); // Update Redux store
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  }

  static async createTemplate(data, dispatch) {
    try {
      const response = await apiClient.post("tests/templates/", data);
      dispatch(fetchTemplates(dispatch)); // Refresh templates after adding
    } catch (error) {
      console.error("Error creating template:", error);
    }
  }
}

export default TemplatesService;
