import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectName() {
  const API_URL = import.meta.env.VITE_API_URL;

  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const validateName = () => {
    if (!name.trim()) {
      setNameError("Project name is required");
      return false;
    }
    setNameError("");
    return true;
  };

  async function submitProjectName(e) {
    e.preventDefault();
    validateName();

    if (
      nameError.length === 0 
    ) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/project`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name: name, 
          }),
        });
        const data = await response.json();

        if (response.status === 201) {
          console.log("Success");
          // navigate("/login");
        } else {
          console.log("Something went wrong");
          console.log("Error details:", data.detail);
          throw new Error("Error from the server");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error in form");
    }
  }

  return (
    <>
      <form onSubmit={submitProjectName} className="p-4 bg-white rounded-lg shadow-md">
        <div>
          <label 
            htmlFor="projectName" 
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Project Name:
          </label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your project name"
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          />
          {nameError && (
            <p className="text-red-500 text-sm mt-1">{nameError}</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Submit
        </button>
      </form>
    </>
  );
}