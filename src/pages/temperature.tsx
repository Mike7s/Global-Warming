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
import NavBar from "../components/navBar";
import Footer from "../components/footer";

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

interface ApiResponse {
  error: null | string;
  result: {
    time: string;
    station: string;
    land: string;
  }[];
}

const parseTime = (time: string) => {
  const year = Math.floor(parseFloat(time));
  const fraction = parseFloat(time) - year;
  const month = Math.round(fraction * 12);
  return new Date(year, month - 1, 1);
};

const Temperature: React.FC = () => {
  const { data, loading, error } = useFetch<ApiResponse>(
    "https://global-warming.org/api/temperature-api"
  );

  const [selectedYear, setSelectedYear] = useState<number>(1900);
  const [filteredLandTemperatures, setFilteredLandTemperatures] = useState<any[]>([]);
  const [filteredStationTemperatures, setFilteredStationTemperatures] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.result) {
      const landTemperatures = data.result.map((entry) => ({
        x: parseTime(entry.time),
        y: parseFloat(entry.land),
      }));

      const stationTemperatures = data.result.map((entry) => ({
        x: parseTime(entry.time),
        y: parseFloat(entry.station),
      }));

      const filteredLand = landTemperatures.filter((entry) => entry.x.getFullYear() === selectedYear);
      const filteredStation = stationTemperatures.filter((entry) => entry.x.getFullYear() === selectedYear);

      setFilteredLandTemperatures(filteredLand);
      setFilteredStationTemperatures(filteredStation);
    }
  }, [data, selectedYear]);

  if (loading) return <p className="text-center text-xl text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!data || !data.result)
    return <p className="text-center text-gray-500">No data available</p>;

  const chartData = {
    datasets: [
      {
        label: "Land Temperature",
        data: filteredLandTemperatures,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
      },
      {
        label: "Station Temperature",
        data: filteredStationTemperatures,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { display: true, text: `Global Temperature Trends - ${selectedYear}`, font: { size: 18 } },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "MMM yyyy",
          displayFormats: { month: "MMM yyyy" },
        },
        title: { display: true, text: "Year" },
        grid: { color: "rgba(53, 162, 235, 0.3)" },
      },
      y: {
        title: { display: true, text: "Anomalous Temperature (°C)" },
        min: -2,
        max: 2,
        grid: { color: "rgba(0, 0, 0, 0.1)" },
      },
    },
  };

  return (
    <>
      <NavBar/>
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-28 mb-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Global Warming Temperature Trends
        </h2>

        <div className="w-full flex flex-col items-center mb-4">
          <label className="font-semibold text-lg mb-2 text-gray-600">
            Select Year: {selectedYear}
          </label>
          <input
            type="range"
            className="w-full accent-blue-600"
            value={selectedYear}
            min={1900}
            max={2025}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          />
        </div>

        <div className="w-full h-[400px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Temperature;
