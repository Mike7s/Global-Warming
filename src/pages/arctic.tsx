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

interface ArcticData {
  date: string;
  value: number;
  anom: number;
  monthlyMean: number;
}

interface ApiResponse {
  arcticData: {
    description: {
      title: string;
      basePeriod: string;
      units: string;
    };
    data: Record<string, ArcticData>;
  };
}

function Arctic() {
  const [selectedYear, setSelectedYear] = useState<number>(2004);
  const [filteredData, setFilteredData] = useState<ArcticData[]>([]);

  const { data, loading, error } = useFetch<ApiResponse>(
    "https://global-warming.org/api/arctic-api"
  );

  useEffect(() => {
    if (data && data.arcticData && data.arcticData.data) {
      const filtered = Object.entries(data.arcticData.data)
        .filter(([key]) => key.startsWith(selectedYear.toString()))
        .map(([date, entry]) => ({
          date: formatDate(date),
          value: entry.value,
          anom: entry.anom,
          monthlyMean: entry.monthlyMean,
        }));

      setFilteredData(filtered);
    }
  }, [data, selectedYear]);

  const formatDate = (yyyymm: string): string => {
    const year = yyyymm.substring(0, 4);
    const month = yyyymm.substring(4, 6);
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
    labels: filteredData.map((item) => item.date),
    datasets: [
      {
        label: "Sea Ice Extent (million km²)",
        data: filteredData.map((item) => item.value),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Anomaly (million km²)",
        data: filteredData.map((item) => item.anom),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Monthly Mean (million km²)",
        data: filteredData.map((item) => item.monthlyMean),
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
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
        text: `Sea Ice Extent Data for ${selectedYear}`,
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
          text: "Million km²",
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
          Sea Ice Extent
        </h2>

        <div className="w-full flex flex-col items-center mb-4">
          <label className="font-semibold text-lg mb-2 text-gray-600">
            Select Year: {selectedYear}
          </label>
          <input
            type="range"
            className="w-full accent-blue-600"
            value={selectedYear}
            min={1979}
            max={2025}
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

export default Arctic;