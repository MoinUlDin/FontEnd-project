import apiClient from "./apiClient";
import {
  setCategoryList,
  setDetailedCategory,
} from "../features/categorySlice";

class CategoryService {
  static async fetchCategoriesList(dispatch) {
    try {
      const response = await apiClient.get("tests/categories/");
      // Depending on your apiClient, you may need to access response.data
      dispatch(setCategoryList(response.data));
    } catch (error) {
      throw error;
    }
  }
  static async fetchDetailedCategory(dispatch, id) {
    try {
      const response = await apiClient.get(`tests/categories/${id}/`);
      // Dispatch the detailed category data along with its id.
      dispatch(setDetailedCategory({ id, data: response.data }));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default CategoryService;
