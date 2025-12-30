"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Product } from "@/base/types/Product";
import { searchProductsApi } from "@/base/utils/api/product";
import { getImageUrl } from "@/base/utils/imageUrl";
import { convertToNumberFormat } from "@/base/utils";
import { useRouter } from "next/navigation";
import "./SearchBar.scss";

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        setHasSearched(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      try {
        const response = await searchProductsApi(query, 1, 10);
        if (response && response.result) {
          setSearchResults(Array.isArray(response.result) ? response.result : []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [searchQuery, debouncedSearch]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(true);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/detail/${productId}`);
    setShowResults(false);
    setSearchQuery("");
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowResults(false);
      setSearchQuery("");
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-bar__input-wrapper">
        <Image
          src="/images/search-interface-symbol.png"
          alt="Search"
          width={20}
          height={20}
          className="search-bar__icon"
        />
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
        />
        {searchQuery && (
          <button
            className="search-bar__clear"
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
              setHasSearched(false);
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          >
            ×
          </button>
        )}
      </div>

      {showResults && (
        <div className="search-bar__results">
          {isLoading ? (
            <div className="search-bar__loading">
              <div className="skeleton" style={{ height: "60px", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "60px", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "60px" }} />
            </div>
          ) : hasSearched && searchQuery.trim().length >= 2 ? (
            searchResults.length > 0 ? (
              <>
                <div className="search-bar__results-header">
                  Found {searchResults.length} {searchResults.length === 1 ? "product" : "products"}
                </div>
                <div className="search-bar__results-list">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="search-bar__result-item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="search-bar__result-item__image">
                        <Image
                          src={getImageUrl(product.imageUrl)}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="image-fade-in"
                        />
                      </div>
                      <div className="search-bar__result-item__info">
                        <h4 className="search-bar__result-item__name">{product.name}</h4>
                        <div className="search-bar__result-item__price">
                          <span className="search-bar__result-item__price-value">
                            {convertToNumberFormat(product.minPrice)}
                          </span>
                          <span className="search-bar__result-item__price-unit">$</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {searchResults.length >= 10 && (
                  <div
                    className="search-bar__results-footer"
                    onClick={() => {
                      router.push(`/product/search?q=${encodeURIComponent(searchQuery)}`);
                      if (onClose) {
                        onClose();
                      }
                    }}
                  >
                    View all results for "{searchQuery}"
                  </div>
                )}
              </>
            ) : (
              <div className="search-bar__no-results">
                No products found for "{searchQuery}"
              </div>
            )
          ) : searchQuery.trim().length > 0 && searchQuery.trim().length < 2 ? (
            <div className="search-bar__hint">
              Type at least 2 characters to search
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export default SearchBar;

