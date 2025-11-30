// utils/renderGradientTitle.tsx
export const renderTitleWithGradient = (
  title: string,
  gradientWord: string,
  gradientFrom: string,
  gradientTo: string,
  useGradient: boolean
) => {
  if (!useGradient || !gradientWord) {
    return title;
  }

  // Case-insensitive search for the word
  const regex = new RegExp(`(\\b${gradientWord}\\b)`, "gi");
  const parts = title.split(regex);

  return parts.map((part, index) => {
    // Check if this part matches the gradient word (case-insensitive)
    if (part.toLowerCase() === gradientWord.toLowerCase()) {
      return (
        <span
          key={index}
          style={{
            // Use separate properties instead of shorthand 'background'
            backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {part}
        </span>
      );
    }
    // Return regular text parts
    return part;
  });
};
