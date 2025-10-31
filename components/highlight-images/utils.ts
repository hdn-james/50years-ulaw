/**
 * Calculate the height for a card wrapper based on its index
 * Each card adds incrementHeight to allow sequential peel effect
 */
export const calculateCardWrapperHeight = (index: number): number => {
  const baseHeight = 640;
  const incrementHeight = 660;
  return baseHeight + index * incrementHeight;
};

/**
 * Calculate the total container height based on number of cards
 */
export const calculateTotalContainerHeight = (totalCards: number): number => {
  const baseHeight = 640;
  const incrementHeight = 660;
  const extraScrollSpace = 400; // Extra space for final scroll
  return baseHeight + (totalCards - 1) * incrementHeight + extraScrollSpace;
};

/**
 * Calculate the spacer height for a card based on its index
 */
export const calculateSpacerHeight = (index: number): number => {
  return index * 20;
};

/**
 * Constants for sticky positioning and z-index
 */
export const STICKY_TOP = 96; // top-24 = 96px

export const calculateZIndex = (index: number, totalCards: number): number => {
  return totalCards - index;
};
