import { useState } from "react";

import Features from "../components/Features";

import GoogleMaps from "../components/GoogleMaps";
import OSM_Maps from "../components/OSM_Maps";
import { classNames } from "../utils";

function ProjectStart ({}) {


  return (
    <>
      <div>
        <GoogleMaps></GoogleMaps>
        {/* <OSM_Maps></OSM_Maps> */}
      </div>

    </>
  );
}

export default ProjectStart;
