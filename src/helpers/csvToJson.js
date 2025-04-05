const csvToJson = (csvText) => {
  // Split the CSV text into non-empty lines.
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return { categories: [] };

  // Parse the header row and normalize headers (lowercase, remove spaces).
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().replace(/\s+/g, ""));

  // Parse each data row into an object mapping header keys to values.
  const data = lines.slice(1).map((line) => {
    // A simple split on comma – this does not handle commas inside quoted fields.
    const values = line.split(",").map((val) => val.trim());
    const rowObj = {};
    headers.forEach((header, index) => {
      rowObj[header] = values[index] || "";
    });
    return rowObj;
  });

  // Group rows by category name.
  const categoriesMap = {};

  data.forEach((row) => {
    // Normalize header keys for category information.
    // Expected header keys: "categoryname" and "categoryweight"
    const catName = row["categoryname"] || "Uncategorized";
    const catWeight = row["categoryweight"] || "";

    // Create a new category if it doesn't exist.
    if (!categoriesMap[catName]) {
      categoriesMap[catName] = {
        category_name: catName,
        category_weight: catWeight,
        questions: [],
      };
    }

    // Build the question object.
    const question = {
      qtype: row["questiontype"] || row["qtype"] || "",
      text: row["questiontext"] || row["text"] || "",
      weight: row["questionweight"] || row["weight"] || "",
      correct_answer: row["correctanswer"] || "",
      options: {
        option1: row["option1"] || "",
        option2: row["option2"] || "",
        option3: row["option3"] || "",
        option4: row["option4"] || "",
      },
    };

    // Add the question to the category.
    categoriesMap[catName].questions.push(question);
  });

  // Convert grouped categories into an array.
  const categories = Object.values(categoriesMap);

  // Return the final JSON object.
  return { categories };
};

export default csvToJson;
