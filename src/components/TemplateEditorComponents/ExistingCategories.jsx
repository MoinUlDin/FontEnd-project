import React, { useState, useEffect } from "react";
import { FiX, FiXCircle } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import CategoryServive from "../../services/categoriesService";
import SecondaryListItem from "../childrens/SecondaryListItem";

function ExistingCategories() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const categories = useSelector((state) => {
    if (state.category) {
      return state.category?.list;
    } else return [];
  });

  useEffect(() => {
    if (categories.length === 0) {
      console.log("sending request for categories list");
      CategoryServive.fetchCategoriesList(dispatch)
        .catch((error) => {
          setError(error);
        })
        .finally(() => {});
    }
  }, [categories.length, dispatch]);

  return (
    <div className="py-8 px-4">
      <h1 className="">
        <span className="hover:text-2xl hover:cursor-pointer hover:text-red-700"></span>
        <div className="">
          {categories.map((item) => (
            <SecondaryListItem id={item.id} title={item.name} />
          ))}
        </div>
      </h1>
    </div>
  );
}

export default ExistingCategories;
