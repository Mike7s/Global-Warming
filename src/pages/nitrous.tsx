import { useEffect, useState } from "react";
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
  Legend
);

interface NitrousData {
  date: string;
  average: string;
  trend: string;
}

interface ApiResponse {
  nitrous: NitrousData[];
}

function Nitrous() {
  const [selectedYear, setSelectedYear] = useState<number>(2004);
  const [filteredData, setFilteredNitrousData] = useState<NitrousData[]>([]);

  const { data, loading, error } = useFetch<ApiResponse>(
    "https://global-warming.org/api/nitrous-oxide-api"
  );

  useEffect(() => {
    if (data && data.nitrous) {
      const filtered = data.nitrous.filter((entry) => {
        const match = entry.date.match(/\d{4}/);
        const year = match ? parseInt(match[0]) : NaN;
        return year === selectedYear;
      });

      setFilteredNitrousData(filtered);
    } else {
      console.error("⚠️ La chiave 'nitrous' non esiste nei dati ricevuti!");
    }
  }, [data, selectedYear]);

  const formatDate = (yyyymm: string): string => {
    const year = yyyymm.substring(0, 4);
    const month = yyyymm.substring(5, 7);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  if (loading) return <p className="text-center text-xl text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (filteredData.length === 0) {
    return <p className="text-center text-gray-500">No data available for the year {selectedYear}</p>;
  }

  const chartData = {
    labels: filteredData.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Average",
        data: filteredData.map((item) => parseFloat(item.average) || 0),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Trend",
        data: filteredData.map((item) => parseFloat(item.trend) || 0),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Nitrous Oxide Levels for ${selectedYear}`,
      },
    },
    scales: {
      x: {
        type: "category" as const,
        title: {
          display: true,
          text: "Month",
        },
        ticks: {
          maxRotation: 45, 
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
        ticks: {
          beginAtZero: true, 
          stepSize: 1, 
        },
      },
    },
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-28 mb-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Nitrous Oxide Levels
        </h2>

        <div className="w-full flex flex-col items-center mb-4">
          <label className="font-semibold text-lg mb-2 text-gray-600">
            Select Year: {selectedYear}
          </label>
          <input
            type="range"
            className="w-full accent-blue-600"
            value={selectedYear}
            min={2003}
            max={2024}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          />
        </div>

        <div className="w-full min-w-[300px] max-w-full h-[300px] sm:h-[400px] lg:h-[500px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Nitrous;