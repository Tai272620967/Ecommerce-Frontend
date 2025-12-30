"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SearchResultsPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    
    // Redirect to /products with query params
    if (query || category) {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      router.replace(`/products?${params.toString()}`);
    } else {
      router.replace("/products");
    }
  }, [searchParams, router]);

  return null;
};

const SearchResultsPage: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <SearchResultsPageContent />
    </Suspense>
  );
};

export default SearchResultsPage;
