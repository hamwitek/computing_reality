import { useState } from "react";
import GoogleMaps from "../components/GoogleMaps";
import ProjectName from "../components/ProjectName";

function Projects ({}) {
  return (
    <>
      <div>
        <ProjectName></ProjectName>
      </div>
      <div>
        <GoogleMaps></GoogleMaps>
      </div>

    </>
  );
}

export default Projects;
