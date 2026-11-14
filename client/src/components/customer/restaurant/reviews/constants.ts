export const STAR_LABELS: Record<number, string> = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Very Good 😊",
  5: "Excellent! 🌟",
};

export const SUGGESTED_TAGS: readonly string[] = [
  "Delicious Food 😋",
  "Super Fast Delivery ⚡",
  "Fresh Ingredients 🥗",
  "Great Packaging 📦",
  "Value for Money 💰",
  "Generous Portions 🍲",
  "Clean & Hygienic 🧼",
  "Polite Staff 👍",
] as const;

export const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
] as const;

export const DEFAULT_REVIEW_PAGE_LIMIT = 6;
export const MAX_COMMENT_LENGTH = 1000;
export const MAX_TAGS_ALLOWED = 5;
