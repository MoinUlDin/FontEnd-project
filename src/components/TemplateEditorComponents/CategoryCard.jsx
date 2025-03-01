import React from "react";
import { FiX } from "react-icons/fi";

export default function CategoryCard({ category, onRemove }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
      <div>
        <h4 className="font-medium">{category.name}</h4>
        <p className="text-sm text-gray-500">Weight: {category.weight}%</p>
      </div>
      <button onClick={onRemove} className="text-red-500 hover:text-red-700">
        <FiX className="w-5 h-5" />
      </button>
    </div>
  );
}
