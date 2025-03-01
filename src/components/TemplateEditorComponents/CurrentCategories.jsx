import React, { useState } from "react";
import InputField from "../../components/childrens/InputField";
import SecondaryListItem from "../childrens/SecondaryListItem";

function CurrentCategories() {
  const [visible, setVisible] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [category, setCategory] = useState({ name: "", weight: "" });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    if (!category.name || !category.weight) {
      alert("Both fields are required!");
      return;
    }

    // Add new category to the list
    setCategoriesList([...categoriesList, { ...category, id: Date.now() }]);

    // Clear input fields and hide form
    setCategory({ name: "", weight: "" });
    setVisible(false);
  };

  // Handler for removing a category by its id
  const handleRemoveCategory = (id) => {
    const updatedList = categoriesList.filter((cat) => cat.id !== id);
    setCategoriesList(updatedList);
  };

  return (
    <div>
      <div className="flex justify-between px-8 py-3">
        <h1>Add categories</h1>
        <button
          onClick={() => setVisible(true)}
          className="btn bg-blue-500 hover:bg-blue-700 text-white rounded-lg p-2"
        >
          Add Category
        </button>
      </div>

      {visible && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col px-3">
            <div className="text-2xl m-5 flex gap-3">
              <InputField
                id="name"
                clable="Name"
                css1="bg-emerald-500"
                value={category.name}
                onChange={(e) =>
                  setCategory({ ...category, name: e.target.value })
                }
              />
              <InputField
                id="weight"
                clable="Weight"
                ctype="number"
                css1="bg-emerald-500"
                value={category.weight}
                onChange={(e) =>
                  setCategory({ ...category, weight: e.target.value })
                }
              />
              <button
                type="submit"
                className="btn px-3 rounded p-2 bg-sunglow self-end mr-8"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Render the list of categories */}
      <div>
        {categoriesList.map((item) => (
          <SecondaryListItem
            key={item.id}
            title={item.name}
            weight={item.weight}
            // Pass the removal handler as a prop
            onRemove={() => handleRemoveCategory(item.id)}
            // Pass other props as needed (e.g., questions)
          />
        ))}
      </div>
    </div>
  );
}

export default CurrentCategories;
