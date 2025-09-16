/**
 * Utility functions for handling flag images with better quality and fallbacks
 */

export const getHighQualityFlagUrl = (originalUrl: string): string => {
  // If it's already a high-quality or custom image, return as-is
  if (!originalUrl.includes('flagcdn.com') || originalUrl.includes('w320') || originalUrl.includes('h240')) {
    return originalUrl;
  }
  
  // Convert low-res flagcdn URLs to higher resolution
  if (originalUrl.includes('flagcdn.com/w80/')) {
    return originalUrl.replace('w80', 'w320'); // 320px width (4x larger)
  }
  
  return originalUrl;
};

export const getFlagFallbacks = (originalUrl: string, title: string): string[] => {
  const fallbacks: string[] = [];
  
  // Try different sizes for flagcdn URLs
  if (originalUrl.includes('flagcdn.com')) {
    const countryCode = originalUrl.split('/').pop()?.replace('.png', '');
    if (countryCode) {
      fallbacks.push(`https://flagcdn.com/w320/${countryCode}.png`); // 320px width
      fallbacks.push(`https://flagcdn.com/h240/${countryCode}.png`); // 240px height
      fallbacks.push(`https://flagcdn.com/w160/${countryCode}.png`); // 160px width
      fallbacks.push(`https://flagcdn.com/w80/${countryCode}.png`);  // Original size
    }
  }
  
  // Add generic fallbacks
  fallbacks.push('/placeholder.svg');
  fallbacks.push('https://via.placeholder.com/320x240/f3f4f6/6b7280?text=' + encodeURIComponent(title));
  
  return fallbacks;
};

export const optimizeImageRendering = (imgElement: HTMLImageElement): void => {
  // Apply CSS properties for better image rendering
  imgElement.style.imageRendering = 'auto';
  imgElement.style.transform = 'translateZ(0)'; // Hardware acceleration
  imgElement.style.backfaceVisibility = 'hidden'; // Prevent flickering
  
  // Set loading attributes
  imgElement.loading = 'lazy';
  imgElement.decoding = 'async';
};