import { useState } from "react";

import Features from "../components/Features";
import IntroVid from "../components/IntroVid";
import { classNames } from "../utils";

function StartPage({}) {

  return (
    <>
      <div>
        <IntroVid></IntroVid>
      </div>

      <div>
        <Features></Features>
      </div>

      <section id="integration" className="p-10 bg-gray-900">
        <h2 className="text-gray-100 text-3xl font-bold text-center">Software Integration</h2>
        <p className="text-gray-100 text-center mt-4">
          Seamlessly export your data to AutoCAD & Rhino 3D.
        </p>
      </section>
    </>
  );
}

export default StartPage;
