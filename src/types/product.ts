export type Category = 'Prendas' | 'T-Shirts' | 'Pants' | 'Jackets' | 'Collares' | 'Aretes' | 'Pulseras' | 'Anillos';

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
