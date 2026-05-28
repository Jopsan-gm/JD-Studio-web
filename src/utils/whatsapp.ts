import { Product } from "@/types/product";

const PHONE_NUMBER = "50686360118";

export const getWhatsAppLink = (product: Product) => {
    const message = `Hola JD Studio! Me interesa este producto:
  
*${product.name}*
Precio: ₡${(product.discount_price || product.price).toLocaleString()}
${typeof window !== 'undefined' ? `Catálogo: ${window.location.href}` : ''}

¿Sigue disponible?`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
};
