import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectName() {
  const API_URL = import.meta.env.VITE_API_URL;

  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const existingProject = localStorage.getItem('project_name');
    if (existingProject) {
      setShowUpdate(true);
      setName(existingProject);
    }
  }, []);

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

    if (nameError.length === 0) {
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
          localStorage.setItem('project_name', name);
          setShowUpdate(true);
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

  async function updateProjectName(e) {
    e.preventDefault();
    validateName();

    if (nameError.length === 0) {
      try {
        const token = localStorage.getItem('token');
        const oldProjectName = localStorage.getItem('project_name');
        
        const response = await fetch(`${API_URL}/project/${oldProjectName}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name: name, 
          }),
        });
        const data = await response.json();

        if (response.status === 200) {
          console.log("Success");
          localStorage.setItem('project_name', name);
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
      <form className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex gap-2 items-center">
          <label 
            htmlFor="projectName" 
            className="text-gray-700 text-sm font-bold whitespace-nowrap"
          >
            Project Name:
          </label>
          <div className="flex-grow flex gap-2">
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
            {!showUpdate && (
              <button
                onClick={submitProjectName}
                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Submit
              </button>
            )}
            {showUpdate && (
              <button
                onClick={updateProjectName}
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                Update
              </button>
            )}
          </div>
        </div>
        {nameError && (
          <p className="text-red-500 text-sm mt-1">{nameError}</p>
        )}
      </form>
    </>
  );
}