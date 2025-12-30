"use client";
import "./PageSkeleton.scss";

export const FormSkeleton: React.FC = () => {
  return (
    <div className="form-skeleton">
      <div className="form-skeleton__field">
        <div className="form-skeleton__label" />
        <div className="form-skeleton__input" />
      </div>
      <div className="form-skeleton__field">
        <div className="form-skeleton__label" />
        <div className="form-skeleton__input" />
      </div>
      <div className="form-skeleton__field">
        <div className="form-skeleton__label" />
        <div className="form-skeleton__input form-skeleton__input--large" />
      </div>
      <div className="form-skeleton__field">
        <div className="form-skeleton__label" />
        <div className="form-skeleton__input" />
      </div>
    </div>
  );
};

export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="order-card-skeleton">
      <div className="order-card-skeleton__header">
        <div className="order-card-skeleton__title" />
        <div className="order-card-skeleton__badges">
          <div className="order-card-skeleton__badge" />
          <div className="order-card-skeleton__badge" />
        </div>
      </div>
      <div className="order-card-skeleton__content">
        <div className="order-card-skeleton__section">
          <div className="order-card-skeleton__section-title" />
          <div className="order-card-skeleton__section-line" />
          <div className="order-card-skeleton__section-line" />
          <div className="order-card-skeleton__section-line" />
        </div>
        <div className="order-card-skeleton__section">
          <div className="order-card-skeleton__section-title" />
          <div className="order-card-skeleton__section-line" />
        </div>
        <div className="order-card-skeleton__totals">
          <div className="order-card-skeleton__total-line" />
          <div className="order-card-skeleton__total-line" />
          <div className="order-card-skeleton__total-line order-card-skeleton__total-line--large" />
        </div>
      </div>
    </div>
  );
};

export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="cart-item-skeleton">
      <div className="cart-item-skeleton__image" />
      <div className="cart-item-skeleton__content">
        <div className="cart-item-skeleton__name" />
        <div className="cart-item-skeleton__price" />
        <div className="cart-item-skeleton__quantity" />
      </div>
    </div>
  );
};

export default FormSkeleton;

