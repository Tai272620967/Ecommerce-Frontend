/**
 * Build image URL from backend API
 * If imageUrl starts with http:// or https://, return as is
 * Otherwise, prepend API base URL
 */
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) {
    return '';
  }

  // If imageUrl is already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Get API base URL (without /api/v1)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8080';
  
  // Ensure imageUrl starts with /
  const normalizedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${apiBaseUrl}${normalizedImageUrl}`;
};

