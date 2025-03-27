import { useState } from "react";
import GoogleMaps from "../components/GoogleMaps";

function ProjectStart ({}) {
  return (
    <>
      <div>
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            const projectName = e.target.projectName.value;
            try {
              const response = await fetch('api/v1/projects/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: projectName })
              });
              if (response.ok) {
                // Add visual feedback
                e.target.projectName.value = '';
                // You might want to store the project ID returned from the backend
                const data = await response.json();
                console.log('Project created:', data);
              }
            } catch (error) {
              console.error('Error creating project:', error);
            }
          }}
          className="mb-5"
        >
          <div className="p-4 bg-white rounded-lg shadow-md">
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
              placeholder="Enter your project name"
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
        </form>
        <GoogleMaps></GoogleMaps>
      </div>

    </>
  );
}

export default ProjectStart;

