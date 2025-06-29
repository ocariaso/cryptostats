import React from "react";
import { useNavigate, Link } from "react-router-dom";

const FavoriteCryptos = ({
  cryptos,
  loading,
  error,
  favorites,
  toggleFavorite,
}) => {
  const navigate = useNavigate();

  const favoriteCoins = cryptos.filter((crypto) => favorites.has(crypto.id));

  if (loading) {
    return (
      <div className="text-center p-4">
        <p className="text-xl text-blue-400">
          Loading your favorite cryptocurrencies...
        </p>{" "}
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
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" // Adjusted button color for dark mode
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (favoriteCoins.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800 shadow-md rounded-lg">
        {" "}
        <p className="text-xl text-gray-300 mb-4">
          {" "}
          You don't have any favorite cryptocurrencies yet.
        </p>
        <p className="text-gray-400 mb-6">
          {" "}
          Go to the{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Home page
          </Link>{" "}
          to add some!
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" // Adjusted button color for dark mode
        >
          Explore Cryptos
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-3xl font-bold text-blue-400 mb-4 text-center">
        {" "}
        My Favorite Cryptocurrencies
      </h2>
      <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {" "}
        <thead className="bg-gray-700">
          {" "}
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
              {" "}
              Fav
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
              {" "}
              Name
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
              {" "}
              Symbol
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
              {" "}
              Price (USD)
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
              {" "}
              24h Change (%)
            </th>
          </tr>
        </thead>
        <tbody>
          {favoriteCoins.map((crypto) => (
            <tr
              key={crypto.id}
              className="border-b border-gray-700 hover:bg-gray-700"
            >
              <td className="py-3 px-4 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(crypto.id);
                  }}
                  className="text-2xl"
                >
                  {favorites.has(crypto.id) ? "⭐" : "☆"}
                </button>
              </td>
              <td
                className="py-3 px-4 text-gray-200 cursor-pointer"
                onClick={() => navigate(`/coin/${crypto.id}`)}
              >
                {crypto.name}
              </td>
              <td
                className="py-3 px-4 text-gray-400 uppercase cursor-pointer"
                onClick={() => navigate(`/coin/${crypto.id}`)}
              >
                {crypto.symbol}
              </td>
              <td
                className="py-3 px-4 text-gray-200 cursor-pointer"
                onClick={() => navigate(`/coin/${crypto.id}`)}
              >
                ${crypto.current_price.toLocaleString()}
              </td>
              <td
                className={`py-3 px-4 ${
                  crypto.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                } cursor-pointer`}
                onClick={() => navigate(`/coin/${crypto.id}`)}
              >
                {crypto.price_change_percentage_24h
                  ? crypto.price_change_percentage_24h.toFixed(2)
                  : "N/A"}
                %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FavoriteCryptos;
