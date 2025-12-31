"use client";

import React, { useState, useEffect } from "react";
import { Review, ReviewDTO } from "@/base/types/review";
import { createReviewApi, updateReviewApi } from "@/base/utils/api/review";
import { message } from "antd";
import "./ReviewForm.scss";

interface ReviewFormProps {
  productId: number;
  existingReview?: Review | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  existingReview,
  onSuccess,
  onCancel,
}) => {
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      message.warning("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      const reviewData: ReviewDTO = {
        rating,
        comment: comment.trim() || undefined,
      };

      if (existingReview) {
        await updateReviewApi(productId, existingReview.id, reviewData);
        message.success("Review updated successfully");
      } else {
        await createReviewApi(productId, reviewData);
        message.success("Review submitted successfully");
      }

      setRating(0);
      setComment("");
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to submit review";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`review-form__rating__star ${
            isFilled ? "review-form__rating__star--filled" : ""
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          aria-label={`Rate ${starValue} stars`}
        >
          ★
        </button>
      );
    });
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__rating">
        <label className="review-form__rating__label">Rating:</label>
        <div className="review-form__rating__stars">{renderStars()}</div>
      </div>

      <div className="review-form__comment">
        <label htmlFor="comment" className="review-form__comment__label">
          Comment (optional):
        </label>
        <textarea
          id="comment"
          className="review-form__comment__textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
        />
      </div>

      <div className="review-form__actions">
        {onCancel && (
          <button
            type="button"
            className="review-form__actions__button review-form__actions__button--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="review-form__actions__button review-form__actions__button--submit"
          disabled={loading || rating === 0}
        >
          {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;

