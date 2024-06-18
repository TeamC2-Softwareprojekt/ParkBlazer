// StarRating.tsx
import React from "react";
import { IonIcon } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (newRating: number) => void; // Made optional for display purposes
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const handleStarClick = (index: number) => {
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <IonIcon
          key={index}
          icon={index < rating ? star : starOutline}
          onClick={() => handleStarClick(index)}
          style={{ fontSize: "20px", cursor: onRatingChange ? "pointer" : "default", color: "var(--ion-color-primary)" }}
        />
      ))}
    </div>
  );
};

export default StarRating;
