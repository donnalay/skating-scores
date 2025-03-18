import {
  scaleLinear,
  scaleBand,
  max,
  scaleSequential,
  interpolateBlues,
  color,
} from "d3";
import "./chart.css";

export default function Bar({ width, height, data }) {
  const margin = 0;
  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d.total)])
    .range([0, width - margin * 8]);
  const yScale = scaleBand()
    .domain(data.map((d) => d.name))
    .range([margin, data.length > 6 ? height : 250])
    .padding(0.08);

  const colorScale = scaleSequential()
    .domain([data.length - 1, 0])
    .interpolator(interpolateBlues);

  const textColor = (fill) => {
    const c = color(fill);
    //luminance formula
    const brightness = (c.r * 0.139 + c.g * 0.587 + c.b * 0.114) / 255;
    return brightness > 0.5 ? "#000" : "#fff";
  };

  const bars = data.map((d, i) => (
    <rect
      key={d.name}
      x={margin}
      y={yScale(d.name) * 1}
      height={yScale.bandwidth() * 1}
      width={xScale(d.total) * 0.9}
      fill={colorScale(i)}
    ></rect>
  ));

  const labels = data.map((d, i) => {
    const fill = colorScale(i);
    return (
      <g key={d.name}>
        <text
          x={8}
          y={yScale(d.name) + 24}
          textAnchor="start"
          fill={textColor(fill)}
          fontSize="1.2rem"
        >
          {i + 1} {d.name}{" "}
          <tspan
            y={yScale(d.name) + 24}
            textAnchor="start"
            fill={textColor(fill)}
            fontWeight={400}
            fontSize="0.95rem"
          >
            {d.country}
          </tspan>
          <tspan
            x={xScale(d.total) * 0.89}
            textAnchor="end"
            fontSize="0.95rem"
            fill={textColor(fill)}
            fontWeight={400}
          >
            {d.sp} SP, {d.lp} LP
          </tspan>
          <tspan
            x={xScale(d.total) * 0.9 + 8}
            textAnchor="start"
            fill="#000"
            fontWeight="600"
          >
            {d.total}
          </tspan>
        </text>
      </g>
    );
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      {bars}
      {labels}
    </svg>
  );
}
