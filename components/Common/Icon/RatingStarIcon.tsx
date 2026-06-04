export const RatingStarIcon = ({
  size = 54,
  filled = false,
  color = "#00a1ff",
}: {
  size?: number;
  filled?: boolean;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} aria-hidden="true">
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      stroke={filled ? color : "#e0e0e0"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
