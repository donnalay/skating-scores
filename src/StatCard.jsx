import { max } from "d3";
import "./index.css";

export default function StatCard({ data, title, value }) {
  const skaters = data.map((d) => d.name);
  const countries = data.map((d) => d.country);
  return (
    <div className="StatCard">
      <h2 className="uppercase">{title}</h2>
      <h3 className="bigValue">{value}</h3>
      <div className="row-inner">
        {" "}
        <p className="badge">{countries[0]}</p>
        <p>{skaters[0]}</p>
      </div>
    </div>
  );
}
