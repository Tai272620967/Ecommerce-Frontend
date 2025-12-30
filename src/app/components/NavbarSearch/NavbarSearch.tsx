"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Category } from "@/base/types/category";
import "./NavbarSearch.scss";

interface NavbarSearchProps {
  categories?: Category[];
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();
    
    // If there's a search query, add it
    if (query) {
      params.set("q", query);
    }
    
    // If a specific category is selected (not "all"), add it
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    
    // Navigate to products page with params (even if empty, it will show all products)
    router.push(`/products?${params.toString()}`);
    setSearchQuery("");
  };

  return (
    <form className="navbar-search" onSubmit={handleSubmit}>
      <div className="navbar-search__category">
        <select
          className="navbar-search__category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="navbar-search__input-wrapper">
        <input
          type="text"
          className="navbar-search__input"
          placeholder="What are you looking for?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button type="submit" className="navbar-search__button">
        <Image
          src="/images/search-interface-symbol.png"
          alt="Search"
          width={20}
          height={20}
        />
      </button>
    </form>
  );
};

export default NavbarSearch;

