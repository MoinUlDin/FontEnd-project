// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditableField from "../components/EditableField";

function ProfilePage() {
  // Extract user info from redux store (adjust based on your actual data structure)
  const user = useSelector((state) => state.auth.user) || {};

  // For demo purposes, assume user may have firstName, lastName, userName, phoneNumber.
  // If these aren’t available, you can derive them from user.userName or show placeholders.
  const initialFirstName =
    user.firstName ||
    (user.userName ? user.userName.split(" ")[0] : "First Name");
  const initialLastName =
    user.lastName ||
    (user.userName ? user.userName.split(" ")[1] || "" : "Last Name");
  const initialUserName = user.userName || "User Name";
  const initialPhoneNumber = user.phoneNumber || "N/A";
  // For password, we’ll show a masked version.
  const initialPassword = "********";

  // For company info, assume company is either an object or string.
  let initialCompanyName = "";
  let initialCompanyOwner = "";
  if (user.company && typeof user.company === "object") {
    initialCompanyName = user.company.name || "Company Name";
    initialCompanyOwner = user.company.owner || "Company Owner";
  } else {
    initialCompanyName = user.company || "Company Name";
    initialCompanyOwner = "Company Owner";
  }
  const initialUserRole = user.role || "User Role";

  // Local state for personal info
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [userName, setUserName] = useState(initialUserName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [password, setPassword] = useState(initialPassword);

  // Local state for company info
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [companyOwner, setCompanyOwner] = useState(initialCompanyOwner);
  const [userRole, setUserRole] = useState(initialUserRole);

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 my-2">Personal Info</h2>
      <EditableField
        label="First Name"
        value={firstName}
        onSave={setFirstName}
      />
      <EditableField label="Last Name" value={lastName} onSave={setLastName} />
      <EditableField label="User Name" value={userName} onSave={setUserName} />
      <EditableField
        label="Phone Number"
        value={phoneNumber}
        onSave={setPhoneNumber}
      />
      <EditableField label="Password" value={password} onSave={setPassword} />

      <h2 className="text-2xl font-bold text-blue-900 my-2 mt-4">
        Company Info
      </h2>
      <EditableField
        label="Company Name"
        value={companyName}
        onSave={setCompanyName}
      />
      <EditableField
        label="Company Owner"
        value={companyOwner}
        onSave={setCompanyOwner}
      />
      <EditableField label="User Role" value={userRole} onSave={setUserRole} />
    </div>
  );
}

export default ProfilePage;
