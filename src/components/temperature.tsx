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

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!data || !data.result) return <p className="text-center">No data</p>;

  
  const chartData = {
    datasets: [
      {
        label: "Temperatura Land",
        data: filteredLandTemperatures,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
        tension: 0.5,
        borderWidth: 3,
        pointRadius: 0,
      },
      {
        label: "Temperatura Station",
        data: filteredStationTemperatures,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: false,
        tension: 0.5,
        borderWidth: 3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Andamento Temperature Globali",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "month",
          tooltipFormat: "MMM yyyy",
          displayFormats: {
            month: "MMM yyyy",
          },
        },
        title: {
          display: true,
          text: "year",
        },
        grid: {
          color: "rgba(53, 162, 235, 0.5)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Abnormal temperature (°C)",
        },
        min: -2,
        max: 2,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-2xl font-bold">Global Warming</h2>

        
        <div className="mb-4 flex flex-col justify-center items-center">
          <label htmlFor="yearSlider" className="mb-2 text-lg">
            Year: {selectedYear}
          </label>
          <input
            id="yearSlider"
            type="range"
            min={1900}
            max={2025}
            step={1}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
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

export default Temperature;
