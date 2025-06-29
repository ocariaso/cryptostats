import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ cryptos, searchTerm, setSearchTerm }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Filter suggestions based on searchTerm
  const suggestions = cryptos.filter(
    (crypto) =>
      crypto &&
      typeof crypto === "object" &&
      typeof crypto.name === "string" &&
      typeof crypto.symbol === "string" &&
      (crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Effect to hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, inputRef]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
    setShowDropdown(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        const selectedCoin = suggestions[highlightedIndex];
        setSearchTerm(selectedCoin.name);
        setShowDropdown(false);
        navigate(`/coin/${selectedCoin.id}`);
      } else {
        // If Enter is pressed without a highlighted suggestion, just perform the search
        setShowDropdown(false);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (cryptoName, coinId) => {
    setSearchTerm(cryptoName);
    setShowDropdown(false);
    navigate(`/coin/${coinId}`);
  };

  return (
    <div className="flex-grow mx-4 max-w-md relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search by name or symbol..."
        className="p-2 border border-gray-600 rounded-lg w-full bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(true)} // Show dropdown on focus
      />

      {searchTerm && showDropdown && suggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
        >
          {suggestions.map((crypto, index) => (
            <li
              key={crypto.id}
              className={`p-3 cursor-pointer hover:bg-gray-700 ${
                index === highlightedIndex ? "bg-gray-700" : ""
              }`}
              onMouseDown={() => handleSuggestionClick(crypto.name, crypto.id)}
            >
              <span className="font-semibold text-gray-200">{crypto.name}</span>
              <span className="text-gray-400 ml-2 uppercase">
                ({crypto.symbol})
              </span>
            </li>
          ))}
        </ul>
      )}

      {searchTerm && showDropdown && suggestions.length === 0 && (
        <div className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1 p-3 text-gray-400 shadow-lg">
          No results found.
        </div>
      )}
    </div>
  );
};

export default SearchBar;
