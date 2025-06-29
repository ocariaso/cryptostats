import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

import CryptoList from "./components/CryptoList";
import CryptoDetail from "./components/CryptoDetail";
import FavoriteCryptos from "./components/FavoriteCryptos";
import SearchBar from "./components/SearchBar";

function App() {
  // --- FAVORITES STATE & LOGIC ---
  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavorites = localStorage.getItem("cryptoFavorites");
      return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "cryptoFavorites",
        JSON.stringify(Array.from(favorites))
      );
    } catch (error) {
      console.error("Failed to save favorites to localStorage", error);
    }
  }, [favorites]);

  const toggleFavorite = (coinId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(coinId)) {
        newFavorites.delete(coinId);
      } else {
        newFavorites.add(coinId);
      }
      return newFavorites;
    });
  };
  // --- END FAVORITES STATE & LOGIC ---

  // --- CRYPTOS DATA STATE & FETCHING LOGIC ---
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        setCryptos(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          "Failed to fetch cryptocurrency data. Please try again later."
        );
        setLoading(false);
        console.error(err);
      }
    };

    fetchCryptos();
  }, []);
  // --- END CRYPTOS DATA STATE & FETCHING LOGIC ---

  // --- SEARCH TERM STATE ---
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <header className="bg-gray-800 shadow p-4 mb-4">
          <nav className="container mx-auto flex items-center justify-between flex-wrap">
            <Link
              to="/"
              className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              CryptoStats
            </Link>

            <SearchBar
              cryptos={cryptos}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <Link
              to="/favorites"
              className="px-3 py-1 rounded-md text-blue-400 hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
            >
              My Favorites ({favorites.size})
            </Link>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <CryptoList
                  cryptos={cryptos}
                  loading={loading}
                  error={error}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              }
            />

            <Route
              path="/coin/:id"
              element={
                <CryptoDetail
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              }
            />

            <Route
              path="/favorites"
              element={
                <FavoriteCryptos
                  cryptos={cryptos}
                  loading={loading}
                  error={error}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  searchTerm={searchTerm}
                />
              }
            />

            <Route
              path="*"
              element={
                <div className="text-center text-lg mt-8">
                  <h2 className="text-2xl font-semibold text-gray-200">
                    404 - Page Not Found
                  </h2>
                  <p className="mt-2 text-gray-300">
                    The page you're looking for doesn't exist.
                  </p>
                  <Link to="/" className="text-blue-400 hover:underline">
                    Go back to Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
