/**
 * Generate WhatsApp link with pre-filled message
 */
export const getWhatsAppLink = (nickname: string = 'Customer'): string => {
  const phoneNumber = '6285215842148'; // Format: country code + number (without +)
  const message = `Halo kak, aku ${nickname} ingin order`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

/**
 * Get WhatsApp link for specific product inquiry
 */
export const getProductWhatsAppLink = (
  nickname: string,
  productName: string,
  productId: number
): string => {
  const phoneNumber = '6285215842148';
  const message = `Halo kak, aku ${nickname} ingin tanya tentang produk "${productName}" (ID: ${productId})`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};