export type Category = 'Oversize' | 'T-Shirts' | 'Pants' | 'Hoodies' | 'Collares' | 'Aretes' | 'Pulseras' | 'Anillos' | 'Van Cleef';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: Category;
    images: string[];
    is_sold_out?: boolean;
    discount_price?: number;
}
