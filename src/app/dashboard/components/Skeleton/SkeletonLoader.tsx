"use client";
import "./SkeletonLoader.scss";

interface SkeletonLoaderProps {
  type?: "card" | "table" | "text" | "circle" | "stat-card";
  width?: string;
  height?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "text",
  width,
  height,
  className = "",
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`skeleton-loader skeleton-loader--${type} ${className}`}
      style={style}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card">
      <SkeletonLoader type="circle" width="48px" height="48px" />
      <div className="skeleton-card__content">
        <SkeletonLoader type="text" width="60%" height="16px" />
        <SkeletonLoader type="text" width="40%" height="24px" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table__header">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLoader key={i} type="text" width="100%" height="20px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table__row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <SkeletonLoader
              key={colIndex}
              type="text"
              width="100%"
              height="16px"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

