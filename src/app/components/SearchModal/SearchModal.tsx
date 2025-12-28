"use client";

import React, { useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import "./SearchModal.scss";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-modal" onClick={onClose}>
      <div
        className="search-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-modal__header">
          <h2 className="search-modal__title">Search Products</h2>
          <button className="search-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="search-modal__body">
          <SearchBar onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

