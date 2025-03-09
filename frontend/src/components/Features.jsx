import React from "react";

export default function Features() {
  return (
    <section id="features" className="p-10 bg-gray-900">
      <h2 className="text-gray-100 text-3xl font-bold text-center">Features</h2>
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="p-6  bg-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold">AI Tree Detection</h3>
          <p>Automatically identify and extract trees from ortho images.</p>
        </div>

        <div className="p-6 bg-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold">Accurate 3D Placement</h3>
          <p>Maintain correct scale and positioning for export.</p>
        </div>

        <div className="p-6 bg-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold">Seamless CAD Export</h3>
          <p>Compatible with AutoCAD and Rhino 3D workflows.</p>
        </div>
      </div>
    </section>
  );
}
