"use client";

import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";
import { Review } from "@/base/types/review";
import { getReviewsApi } from "@/base/utils/api/review";
import { getImageUrl } from "@/base/utils/imageUrl";
import "./ReviewList.scss";

interface ReviewListProps {
  productId: number;
  currentUserId?: number;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
}

export interface ReviewListRef {
  refresh: () => void;
  removeReview: (reviewId: number) => void;
}

const ReviewList = forwardRef<ReviewListRef, ReviewListProps>(({
  productId,
  currentUserId,
  onEdit,
  onDelete,
}, ref) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Reset to page 1 when productId changes
  useEffect(() => {
    setPage(1);
    setReviews([]);
    setHasMore(true);
  }, [productId]);

  // Fetch reviews when productId or page changes
  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  // Expose refresh and removeReview methods to parent component
  useImperativeHandle(ref, () => ({
    refresh: () => {
      refreshReviews();
    },
    removeReview: (reviewId: number) => {
      // Optimistically remove review from UI immediately
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    },
  }));

  // Refresh reviews without showing loading state to prevent flickering
  const refreshReviews = async () => {
    try {
      setIsRefreshing(true);
      const response = await getReviewsApi(productId, 1, 10);
      const reviewsData = response.content || [];
      setReviews(reviewsData);
      setHasMore(1 < (response.totalPages || 0));
      setPage(1);
    } catch (error) {
      console.error("Error fetching reviews on refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviewsApi(productId, page, 10);
      if (page === 1) {
        setReviews(response.content || []);
      } else {
        setReviews((prev) => [...prev, ...(response.content || [])]);
      }
      setHasMore(page < (response.totalPages || 0));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`review-list__item__rating__star ${
          index < rating ? "review-list__item__rating__star--filled" : ""
        }`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDefaultAvatar = (): string => {
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop";
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="review-list">
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (!loading && reviews.length === 0) {
    return (
      <div className="review-list">
        <p className="review-list__empty">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-list__item">
          <div className="review-list__item__header">
            <div className="review-list__item__user">
              <Image
                src={review.userAvatarUrl ? getImageUrl(review.userAvatarUrl) : getDefaultAvatar()}
                alt={review.userName}
                width={40}
                height={40}
                className="review-list__item__user__avatar"
                unoptimized
              />
              <div className="review-list__item__user__info">
                <p className="review-list__item__user__name">{review.userName}</p>
                <p className="review-list__item__user__date">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            {currentUserId === review.userId && (
              <div className="review-list__item__actions">
                {onEdit && (
                  <button
                    className="review-list__item__actions__button"
                    onClick={() => onEdit(review)}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    className="review-list__item__actions__button review-list__item__actions__button--delete"
                    onClick={() => onDelete(review.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="review-list__item__rating">
            {renderStars(review.rating)}
          </div>
          {review.comment && (
            <p className="review-list__item__comment">{review.comment}</p>
          )}
        </div>
      ))}
      {hasMore && (
        <button
          className="review-list__load-more"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading || isRefreshing}
        >
          {loading ? "Loading..." : "Load More Reviews"}
        </button>
      )}
    </div>
  );
});

ReviewList.displayName = "ReviewList";

export default ReviewList;
