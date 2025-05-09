import { useState, useEffect } from "react";
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

  const [selectedYear, setSelectedYear] = useState<number>(1989);
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
    return <p className="text-center text-gray-500">No data for this year {selectedYear}</p>;
  }

  const chartData = {
    labels: filteredData.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Methane Levels (Average)",
        data: filteredData.map((item) => parseFloat(item.average)),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Trend",
        data: filteredData.map((item) => parseFloat(item.trend)),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: true, position: "top" as const },
      title: { display: true, text: `Methane Levels in ${selectedYear}` },
    },
    scales: {
      x: {
        type: "category" as const,
        title: { display: true, text: "Month" },
        ticks: { maxRotation: 45, minRotation: 45 },
      },
      y: {
        title: { display: true, text: "Concentration of Methane (ppb)" },
      },
    },
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-28 mb-4">
          <h2 className="text-2xl font-bold text-center mb-4 text-black">Methane Levels Over Time</h2>
          <div className="w-full flex flex-col items-center mb-4">
            <label className="font-semibold text-lg mb-2 text-black">Select Year: {selectedYear}</label>
            <input
              type="range"
              className="w-full accent-blue-600"
              value={selectedYear}
              min={1984}
              max={2024}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            />
          </div>

          <div className="w-full h-[400px]"> 
            <Line data={chartData} options={options} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Methane;
