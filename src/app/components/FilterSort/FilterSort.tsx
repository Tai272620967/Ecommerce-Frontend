"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./FilterSort.scss";

export type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";

interface FilterSortProps {
  onFilterChange?: (filters: FilterState) => void;
  onSortChange?: (sort: SortOption) => void;
}

export interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
}

const FilterSort: React.FC<FilterSortProps> = ({ onFilterChange, onSortChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState<SortOption>((searchParams.get("sort") as SortOption) || "default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Update URL params when filters or sort change
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }
    
    if (sort && sort !== "default") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    // Update URL without triggering navigation
    if (typeof window !== "undefined") {
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    // Notify parent components
    if (onFilterChange) {
      onFilterChange({
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      });
    }

    if (onSortChange) {
      onSortChange(sort);
    }
  }, [minPrice, maxPrice, sort, searchParams, onFilterChange, onSortChange]);

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSort("default");
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("sort");
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl);
  };

  const hasActiveFilters = minPrice || maxPrice || (sort && sort !== "default");

  return (
    <div className="filter-sort">
      <div className="filter-sort__header">
        <button
          className="filter-sort__toggle"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="#3c3c43"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && <span className="filter-sort__badge">●</span>}
        </button>

        <div className="filter-sort__sort">
          <label htmlFor="sort-select" className="filter-sort__sort-label">
            Sort by:
          </label>
          <select
            id="sort-select"
            className="filter-sort__sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="filter-sort__panel">
          <div className="filter-sort__section">
            <h3 className="filter-sort__section-title">Price Range</h3>
            <div className="filter-sort__price-inputs">
              <div className="filter-sort__price-input-group">
                <label htmlFor="min-price" className="filter-sort__price-label">
                  Min Price ($)
                </label>
                <input
                  id="min-price"
                  type="number"
                  className="filter-sort__price-input"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
              </div>
              <div className="filter-sort__price-input-group">
                <label htmlFor="max-price" className="filter-sort__price-label">
                  Max Price ($)
                </label>
                <input
                  id="max-price"
                  type="number"
                  className="filter-sort__price-input"
                  placeholder="No limit"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="filter-sort__actions">
              <button
                className="filter-sort__clear"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSort;

