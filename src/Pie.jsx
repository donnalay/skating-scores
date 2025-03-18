import React, { useState, useEffect } from "react";
import { pie, arc, scaleOrdinal, schemeAccent } from "d3";
import Select from "react-select";

export default function Pie({ data, width, height, outerRadius }) {
  // Ensure selectedSkater is initialized to the first skater in the list
  const [selectedSkater, setSelectedSkater] = useState(data[0].name || "");
  const [selectedProgram, setSelectedProgram] = useState("ShortProgram");

  const skaters = data.map((d) => ({ value: d.name, label: d.name }));
  const programs = [{ value: "ShortProgram", label: "Short Program" }];

  const skaterData = data.find((d) => d.name === selectedSkater);
  const elements = skaterData.spElements;

  useEffect(() => {
    if (!elements.length) return;
  }, [selectedSkater, selectedProgram]);

  const margin = 24;
  const radius = Math.min(width, height) / 2 - margin;

  // Create Pie Layout
  const pieGenerator = pie()
    .value((d) => d.TotalValue) // Function to extract values correctly
    .sort((a, b) => b.TotalValue - a.TotalValue); // Sorting based on TotalValue

  const pieData = pieGenerator(elements); // Generate pie data based on selected program's elements

  // Arc Generator
  const arcGenerator = arc()
    .innerRadius(radius / 1.4)
    .outerRadius(radius)
    .cornerRadius(4);

  // Arc Generator for Labels (placing text slightly inside the slice)
  const labelArc = arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 1.3);

  const colorScale = scaleOrdinal(schemeAccent).domain(
    elements.map((d) => d.name)
  );

  const pieSlice = pieData.map((d, i) => {
    return (
      <path
        title={d.data.Name}
        key={i}
        d={arcGenerator(d)}
        fill={colorScale(d.data.Name)}
        stroke="white"
        strokeWidth={2}
      />
    );
  });
  const text = pieData.map((d, i) => {
    const [x, y] = labelArc.centroid(d); // Get label position

    // Dynamically adjust text alignment
    const textAnchor = x > 0 ? "start" : "end";

    return (
      <text
        key={i}
        transform={`translate(${x}, ${y + 4})`}
        textAnchor={textAnchor}
        fontSize={10}
        fill="black"
        fontWeight={400}
      >
        {d.data.Name}
        <tspan fontWeight={500}> {d.data.TotalValue}</tspan>
      </text>
    );
  });

  console.log(data);
  return (
    <div>
      <div
        className="row-outer"
        style={{
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "1rem",
          gap: "1rem",
        }}
      >
        {/* Program Select (react-select) */}
        <Select
          options={programs}
          value={programs.find((program) => program.value === selectedProgram)}
          onChange={(selectedOption) =>
            setSelectedProgram(selectedOption.value)
          }
        />
        {/* Skater Select (react-select) */}
        <Select
          options={skaters}
          value={skaters.find((skater) => skater.value === selectedSkater)}
          onChange={(selectedOption) => setSelectedSkater(selectedOption.value)}
        />
        <p>
          Total score: <strong>{skaterData.spScore}</strong>
        </p>
      </div>

      {/* Pie Chart */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio={"xMidYMid meet"}
        style={{
          shapeRendering: "geometricPrecision",
          textRendering: "optimizeLegibility",
        }}
      >
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {pieData.map((d, i) => (
            <g key={i}>
              {/* Pie Slice */}
              {pieSlice}
              {text}
              {/* Label */}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
