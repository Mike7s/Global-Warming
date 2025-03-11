import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import NavBar from "./navBar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface MethaneData {
  date: string;
  average: string;
  trend: string;
}

interface MethaneApiResponse {
  methane: MethaneData[];
}

function Methane() {
  const { data, loading, error } = useFetch<MethaneApiResponse>(
    "https://global-warming.org/api/methane-api"
  );

  const [selectedYear, setSelectedYear] = useState<number>(1984);
  const [filteredData, setFilteredData] = useState<MethaneData[]>([]);

  useEffect(() => {
    if (data && data.methane) {
      const filtered = data.methane.filter((entry) => {
        const year = parseInt(entry.date.split(".")[0]);
        return year === selectedYear;
      });

      setFilteredData(filtered);
    }
  }, [data, selectedYear]);

  if (loading) return <p className="text-center text-xl text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  if (filteredData.length === 0) {
    return <p className="text-center text-gray-500">No data for this year{selectedYear}</p>;
  }

  const chartData = {
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: "Methane Levels (Average)",
        data: filteredData.map((item) => parseFloat(item.average)),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Trend",
        data: filteredData.map((item) => parseFloat(item.trend)),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: `Methane Levels in ${selectedYear}` },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "concentration of methane (ppb)",
        },
      },
    },
  };

  return (
    <>
<NavBar/>
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-16">
      <h2 className="text-2xl font-bold text-center mb-4 text-black">Methane Levels Over Time</h2>
      <div className="w-full flex flex-col items-center mb-4">
        <label className="font-semibold text-lg mb-2 text-black">Select year: {selectedYear}</label>
        <input
          type="range"
          className="w-full accent-blue-600"
          value={selectedYear}
          min={1984}
          max={2024}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          />
      </div>

      <div className="w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
    </>
  );
    
}

export default Methane;