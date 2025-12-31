"use client";

import React, { useEffect, useState, useRef } from "react";
import { Review, ReviewStats } from "@/base/types/review";
import { getReviewStatsApi } from "@/base/utils/api/review";
import { createReviewApi, updateReviewApi, deleteReviewApi } from "@/base/utils/api/review";
import { message, Modal } from "antd";
import ReviewList, { ReviewListRef } from "./ReviewList";
import ReviewForm from "./ReviewForm";
import { useAppSelector } from "@/base/redux/hook";
import authStorage from "@/base/storage/auth";
import "./ReviewSection.scss";

interface ReviewSectionProps {
  productId: number;
  onReviewAdded?: () => void; // Callback when a new review is added
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, onReviewAdded }) => {
  const user = useAppSelector((state) => state.user.user);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const reviewListRef = useRef<ReviewListRef>(null);

  useEffect(() => {
    fetchStats();
  }, [productId]);

  // Fetch stats without showing loading state to prevent flickering
  const fetchStats = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const statsData = await getReviewStatsApi(productId);
      // Ensure averageRating is a valid number
      if (statsData && (statsData.averageRating === null || statsData.averageRating === undefined)) {
        statsData.averageRating = 0;
      }
      if (statsData && (statsData.reviewCount === null || statsData.reviewCount === undefined)) {
        statsData.reviewCount = 0;
      }
      setStats(statsData);
    } catch (error) {
      // Error fetching stats - set default values
      setStats({ averageRating: 0, reviewCount: 0 });
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Optimistically update stats when a review is added
  const updateStatsOptimistically = (newRating: number, isAdd: boolean) => {
    setStats((prevStats) => {
      if (!prevStats) return prevStats;
      const newCount = isAdd ? prevStats.reviewCount + 1 : Math.max(0, prevStats.reviewCount - 1);
      if (newCount === 0) {
        return { averageRating: 0, reviewCount: 0 };
      }
      // Calculate new average (simplified - actual calculation should be done server-side)
      // For now, we'll fetch the real stats in the background
      return {
        ...prevStats,
        reviewCount: newCount,
      };
    });
  };

  const handleReviewSuccess = async () => {
    setShowForm(false);
    setEditingReview(null);
    // Optimistically update stats
    updateStatsOptimistically(0, true);
    // Optimistically update the review list without showing loading
    if (reviewListRef.current) {
      reviewListRef.current.refresh();
    }
    // Update stats in background without showing loading state
    fetchStats(false);
    // Notify parent component that a review was added
    if (onReviewAdded) {
      onReviewAdded();
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = async (reviewId: number) => {
    Modal.confirm({
      title: "Delete Review",
      content: "Are you sure you want to delete this review? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          // Optimistically remove the review from the list immediately
          if (reviewListRef.current) {
            reviewListRef.current.removeReview(reviewId);
          }
          // Optimistically update stats
          updateStatsOptimistically(0, false);
          
          // Call API to delete review
          await deleteReviewApi(productId, reviewId);
          message.success("Review deleted successfully");
          
          // Refresh reviews list to ensure sync with server
          if (reviewListRef.current) {
            reviewListRef.current.refresh();
          }
          
          // Update stats in background without showing loading state
          fetchStats(false);
          
          // Notify parent component that a review was deleted
          if (onReviewAdded) {
            onReviewAdded();
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Failed to delete review";
          message.error(errorMessage);
          // Revert optimistic update on error - refresh to get correct state
          if (reviewListRef.current) {
            reviewListRef.current.refresh();
          }
          fetchStats(false);
        }
      },
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const renderStars = (rating: number) => {
    const safeRating = rating || 0;
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`review-section__stats__rating__star ${
          index < Math.round(safeRating) ? "review-section__stats__rating__star--filled" : ""
        }`}
      >
        ★
      </span>
    ));
  };

  const isAuthenticated = authStorage.authenticated() && user?.id;

  return (
    <div className="review-section">
      <div className="review-section__header">
        <h2 className="review-section__header__title">Customer Reviews</h2>
        {stats && typeof stats.averageRating === 'number' && (
          <div className="review-section__stats">
            <div className="review-section__stats__rating">
              {renderStars(stats.averageRating)}
              <span className="review-section__stats__rating__value">
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
            <p className="review-section__stats__count">
              Based on {stats.reviewCount || 0} {stats.reviewCount === 1 ? "review" : "reviews"}
            </p>
          </div>
        )}
      </div>

      {isAuthenticated && !showForm && (
        <button
          className="review-section__add-button"
          onClick={() => setShowForm(true)}
        >
          Write a Review
        </button>
      )}

      {showForm && (
        <ReviewForm
          productId={productId}
          existingReview={editingReview}
          onSuccess={handleReviewSuccess}
          onCancel={handleCancel}
        />
      )}

      <ReviewList
        ref={reviewListRef}
        productId={productId}
        currentUserId={user?.id ? Number(user.id) : undefined}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ReviewSection;
