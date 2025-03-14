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

interface Co2Data {
  year: string;
  month: string;
  day: string;
  cycle: string;
  trend: string;
  date?: Date;
}

interface ApiResponse {
  co2: Co2Data[];
}

const parseCo2Time = (year: string, month: string, day: string) => {
  const numericYear = parseInt(year, 10);
  const numericMonth = parseInt(month, 10) - 1;
  const numericDay = parseInt(day, 10);
  return new Date(numericYear, numericMonth, numericDay);
};

function Co2() {
  const { data, loading, error } = useFetch<ApiResponse>(
    "https://global-warming.org/api/co2-api"
  );
  const [selectedYear, setSelectedYear] = useState<number>(2015);
  const [filteredCo2Data, setFilteredCo2Data] = useState<Co2Data[]>([]);

  useEffect(() => {
    if (data && data.co2) {
      const filteredData = data.co2
        .map((entry) => ({
          ...entry,
          date: parseCo2Time(entry.year, entry.month, entry.day),
        }))
        .filter((entry) => entry.date.getFullYear() === selectedYear)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setFilteredCo2Data(filteredData);
    }
  }, [selectedYear, data]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const chartData = {
    datasets: [
      {
        label: "Cycle",
        data: filteredCo2Data.map((entry) => ({
          x: entry.date,
          y: parseFloat(entry.cycle),
        })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: "Trend",
        data: filteredCo2Data.map((entry) => ({
          x: entry.date,
          y: parseFloat(entry.trend),
        })),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `CO2 Levels - ${selectedYear}`,
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "MMM yyyy",
          displayFormats: {
            month: "MMM yyyy",
          },
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "CO2 (ppm)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!data || !data.co2) return <p className="text-center">No data</p>;

  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center flex-col bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto mt-28 mb-4">
        <h2 className="text-2xl font-bold text-gray-700">CO2 Levels Over Time</h2>

        <div className="mb-4 flex flex-col justify-center items-center w-full">
          <label htmlFor="yearSlider" className="mb-2 text-lg text-gray-600">
            Year: {selectedYear}
          </label>
          <input
            id="yearSlider"
            type="range"
            min={2015}
            max={2025}
            step={1}
            value={selectedYear}
            onChange={handleSliderChange}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="w-full h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
     <Footer/>
    </>
  );
}

export default Co2;
