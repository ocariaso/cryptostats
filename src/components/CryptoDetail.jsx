import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Chart.js imports
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
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CryptoDetail = ({ favorites, toggleFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);

  const isFavorite = favorites.has(id);

  useEffect(() => {
    const fetchCoinDetailAndChartData = async () => {
      try {
        setLoading(true);
        const [detailResponse, marketChartResponse] = await axios.all([
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}`),
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
          ),
        ]);

        setCoin(detailResponse.data);
        setPriceHistory(marketChartResponse.data.prices);
        setLoading(false);
      } catch (err) {
        setError(
          "Failed to fetch coin details or chart data. Please check the coin ID or try again later."
        );
        setLoading(false);
        console.error(err);
      }
    };

    fetchCoinDetailAndChartData();
  }, [id]);

  // --- Conditional Renders for Loading/Error/Not Found ---
  if (loading) {
    return (
      <div className="text-center p-4">
        <p className="text-xl text-blue-400">Loading coin details...</p>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-400">
        {" "}
        <p className="text-xl">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
        >
          Back to List
        </button>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="text-center p-4 text-red-400">
        {" "}
        <p className="text-xl">Coin not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
        >
          Back to List
        </button>
      </div>
    );
  }
  // --- END Conditional Renders ---

  // Prepare data for Chart.js
  const chartData = {
    labels: priceHistory.map((dataPoint) => {
      const date = new Date(dataPoint[0]);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }),
    datasets: [
      {
        label: `${coin.name} Price (USD)`,
        data: priceHistory.map((dataPoint) => dataPoint[1]),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgb(156, 163, 175)",
        },
      },
      title: {
        display: true,
        text: `7-Day Price Trend for ${coin.name}`,
        color: "rgb(75, 192, 192)",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(100, 100, 100, 0.2)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
      y: {
        grid: {
          color: "rgba(100, 100, 100, 0.2)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          callback: function (value) {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(value);
          },
        },
      },
    },
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-6">
      {" "}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors" 
        >
          &larr; Back to List
        </button>
        <button
          onClick={() => toggleFavorite(coin.id)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center
            ${
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }
          `}
        >
          <span className="text-xl mr-2">{isFavorite ? "⭐" : "☆"}</span>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      </div>
      <h2 className="text-3xl font-bold text-blue-400 mb-4 flex items-center">
        {" "}
        {coin.image && (
          <img
            src={coin.image.small}
            alt={coin.name}
            className="w-8 h-8 mr-3"
          />
        )}
        {coin.name} ({coin.symbol?.toUpperCase()})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-400 text-lg"> Current Price:</p>
          <p className="text-2xl font-semibold text-green-400">
            {" "}
            {coin.market_data?.current_price?.usd?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-lg"> Market Cap:</p>
          <p className="text-2xl font-semibold text-gray-200">
            {" "}
            {coin.market_data?.market_cap?.usd?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-lg"> Total Supply:</p>
          <p className="text-2xl font-semibold text-gray-200">
            {" "}
            {coin.market_data?.total_supply?.toLocaleString() || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-lg"> 24h Price Change:</p>
          <p
            className={`text-2xl font-semibold ${
              coin.market_data?.price_change_percentage_24h >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {coin.market_data?.price_change_percentage_24h?.toFixed(2) || "N/A"}
            %
          </p>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-gray-200 mb-2">
        {" "}
        Description
      </h3>
      {coin.description?.en ? (
        <div
          className="prose prose-invert max-w-none text-gray-300"
          dangerouslySetInnerHTML={createMarkup(coin.description.en)}
        ></div>
      ) : (
        <p className="text-gray-400"> No description available.</p>
      )}
      <h3 className="text-2xl font-semibold text-gray-200 mt-6 mb-2">
        {" "}
        7-Day Price Trend
      </h3>
      <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-center h-96">
        {" "}
        {priceHistory.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="text-gray-400"> No 7-day price data available.</p>
        )}
      </div>
    </div>
  );
};

export default CryptoDetail;
