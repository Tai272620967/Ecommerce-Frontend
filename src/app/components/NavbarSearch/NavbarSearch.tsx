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
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      if (selectedCategory && selectedCategory !== "all") {
        router.push(`/product/search?q=${encodeURIComponent(query)}&category=${selectedCategory}`);
      } else {
        router.push(`/product/search?q=${encodeURIComponent(query)}`);
      }
      setSearchQuery("");
    }
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

