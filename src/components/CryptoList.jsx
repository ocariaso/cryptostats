import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CryptoList = ({
  cryptos,
  loading,
  error,
  favorites,
  toggleFavorite,
  searchTerm,
  setSearchTerm,
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndFilteredCryptos = [...filteredCryptos].sort((a, b) => {
    if (sortColumn === null) return 0;

    let valueA = a[sortColumn];
    let valueB = b[sortColumn];

    if (sortColumn === "name" || sortColumn === "symbol") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }

    if (sortDirection === "asc") {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  if (loading) {
    return (
      <div className="text-center p-4">
        <p className="text-xl text-blue-400">Loading cryptocurrencies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-xl text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Main cryptocurrency table */}
      <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {/* Table header section */}
        <thead className="bg-gray-700">
          <tr>
            {/* "Fav" column header */}
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
              Fav
            </th>
            {/* Name column header (sortable) */}
            <th
              className="py-3 px-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
              onClick={() => handleSort("name")}
            >
              Name
              {sortColumn === "name" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            {/* Symbol column header (sortable) */}
            <th
              className="py-3 px-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
              onClick={() => handleSort("symbol")}
            >
              Symbol
              {sortColumn === "symbol" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            {/* Price column header (sortable) */}
            <th
              className="py-3 px-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
              onClick={() => handleSort("current_price")}
            >
              Price (USD)
              {sortColumn === "current_price" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            {/* 24h Change column header (sortable) */}
            <th
              className="py-3 px-4 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
              onClick={() => handleSort("price_change_percentage_24h")}
            >
              24h Change (%)
              {sortColumn === "price_change_percentage_24h" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
          </tr>
        </thead>
        {/* Table body section */}
        <tbody>
          {/* Map over sorted and filtered cryptocurrencies */}
          {sortedAndFilteredCryptos.map((crypto) => (
            <tr
              key={crypto.id}
              className="border-b border-gray-700 hover:bg-gray-700"
            >
              {/* Favorite icon column */}
              <td className="py-3 px-4 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(crypto.id);
                  }}
                  className="text-2xl"
                >
                  {/* Conditional star rendering based on favorite status */}
                  {favorites.has(crypto.id) ? "⭐" : "☆"}
                </button>
              </td>
              {/* Coin Name column (clickable for navigation) */}
              <td
                className="py-3 px-4 text-gray-200 cursor-pointer"
                onClick={() => navigate(`/coin/${crypto.id}`)}
              >
                {crypto.name}
              </td>
              {/* Coin Symbol column (clickable for navigation) */}
              <td
                className="py-3 px-4 text-gray-400 uppercase cursor-pointer"
                onClick={() => navigate(`/coin/${crypto.id}`)}
              >
                {crypto.symbol}
              </td>
              {/* Current Price column (clickable for navigation) */}
              <td
                className="py-3 px-4 text-gray-200 cursor-pointer"
                onClick={() => navigate(`/coin/${crypto.id}`)}
              >
                ${crypto.current_price.toLocaleString()}
              </td>
              {/* 24h Change column (clickable for navigation) */}
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

export default CryptoList;
