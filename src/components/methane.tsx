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

interface MethaneApiResponse {
  methane: {
    date: string;
    average: string;
    trend: string;
    averageUnc: string;
    trendUnc: string;
  }[];
}

// Funzione per estrarre l'anno dalla data decimale "1984.11"
const parseYear = (date: string) => Math.floor(parseFloat(date));

const Methane = () => {
  const { data, loading, error } = useFetch<MethaneApiResponse>(
    "https://global-warming.org/api/methane-api"
  );

  const [selectedYear, setSelectedYear] = useState<number>(1984);
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.methane) {
      const methaneData = data.methane.map((entry) => ({
        x: new Date(parseYear(entry.date), (parseFloat(entry.date) % 1) * 12, 1),
        y: parseFloat(entry.average),
        trend: parseFloat(entry.trend),
        averageUnc: parseFloat(entry.averageUnc),
        trendUnc: parseFloat(entry.trendUnc),
      }));

      setAllData(methaneData);
    }
  }, [data]);

  useEffect(() => {
    if (allData.length > 0) {
      const filtered = allData.filter((entry) => entry.x.getFullYear() === selectedYear);
      setFilteredData(filtered.length > 0 ? filtered : allData);
    }
  }, [selectedYear, allData]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!data || !data.methane) return <p className="text-center">No data</p>;

  const chartData = {
    datasets: [
      {
        label: "Methane Levels (Average)",
        data: filteredData.map(entry => ({ x: entry.x, y: entry.y })),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 5,
      },
      {
        label: "Trend",
        data: filteredData.map(entry => ({ x: entry.x, y: entry.trend })),
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 5,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `Methane Levels in ${selectedYear}`,
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "month",
          tooltipFormat: "MMM yyyy",
          displayFormats: { month: "MMM yyyy" },
        },
        title: {
          display: true,
          text: "Date",
        },
        grid: { color: "rgba(75, 192, 192, 0.5)" },
      },
      y: {
        title: { display: true, text: "Methane Concentration (ppb)" },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
      },
    },
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold">Methane Levels Over Time</h2>

        <div className="mb-4 flex flex-col justify-center items-center">
          <label htmlFor="yearSlider" className="mb-2 text-lg">
            Year: {selectedYear}
          </label>
          <input
            id="yearSlider"
            type="range"
            min={1984}
            max={2024}
            step={1}
            value={selectedYear}
            onChange={handleSliderChange}
            className="w-64"
          />
        </div>

        <div className="w-8/12 aspect-video">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </>
  );
};

export default Methane;
