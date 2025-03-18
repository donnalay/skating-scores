import "./index.css";
import getData from "./skating.json";
import Bar from "./Bar";
import Pie from "./Pie";
import StatCard from "./StatCard";
import { max } from "d3";
import Select from "react-select";
import { useState } from "react";

function App() {
  const sliceMin = 0;
  const sliceMax = 6;
  const data = getData
    .map((d) => {
      return {
        name: d.Name,
        country: d.Country,
        sp: d.Y24.GrandPrixFinal.spScore,
        spElements: d.Y24.GrandPrixFinal.spElements,
        lp: d.Y24.GrandPrixFinal.lpScore,
        lpElements: d.Y24.GrandPrixFinal.lpElements,
        total: (
          d.Y24.GrandPrixFinal.spScore + d.Y24.GrandPrixFinal.lpScore
        ).toFixed(2),
        event: d.Y24.GrandPrixFinal.Name,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(sliceMin, sliceMax);

  const topTotalScore = max(data.map((d) => d.total));
  const topLPScore = max(data.map((d) => d.lp));
  const topSPScore = max(data.map((d) => d.sp));

  const topLPelementScores = max(
    data.map((d) => d.lpElements.map((a) => a.TotalValue))
  );
  const topLPelement = Math.max(...topLPelementScores);

  const lpElements = getData.map((d) => {
    return {
      name: d.Name,
      lpElements: d.Y24.GrandPrixFinal.lpElements,
    };
  });

  const lpTopElement = lpElements.map((d) => {
    return {
      name: d.name,
      element: d.lpElements.map((a) => a.Name),
      score: d.lpElements.map((b) => b.TotalValue),
    };
  });

  const spElements = getData.map((d) => {
    return {
      name: d.Name,
      spScore: d.Y24.GrandPrixFinal.spScore,
      spElements: d.Y24.GrandPrixFinal.spElements.map((a) => ({
        Name: a.Name,
        TotalValue: a.TotalValue,
      })),
    };
  });

  const eventName = data.map((d) => [d.event]);
  const eventYear = data.map((d) => [d.event]);
  return (
    <div className="App">
      <h1 style={{ padding: "1rem 0", fontWeight: 500 }}>
        2024 {eventName[0]} Data
      </h1>
      <div className="row-outer">
        {" "}
        <StatCard data={data} value={topTotalScore} title={"Top Total Score"} />
        <StatCard data={data} value={topLPScore} title={"Top LP Score"} />
        <StatCard data={data} value={topLPelement} title={"Top LP Element"} />
        <StatCard data={data} value={topSPScore} title={"Top SP Score"} />
      </div>

      <div className="container">
        <h2 className="title">Program Elements</h2>
        {/* <Select defaultValue={event} onChange={setEvent} options={options} /> */}
        <Pie
          width={800}
          height={250}
          innerRadius={0}
          outerRadius={100}
          data={spElements}
        />
      </div>
      <div className="container">
        <div className="header"></div>
        <h2 className="title">Total Score by Competitor</h2>
        <Bar width={900} height={250} data={data} />
      </div>
    </div>
  );
}

export default App;
