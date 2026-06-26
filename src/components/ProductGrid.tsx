import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-6 px-2 md:px-8 pb-20">
                {[...Array(8)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center px-4"
            >
                <p className="text-[#C5FF30] font-mono text-lg uppercase tracking-widest mb-2 font-bold">
                    // Cero resultados //
                </p>
                <p className="text-zinc-500 font-sans text-xs uppercase tracking-widest max-w-md mx-auto">
                    No encontramos prendas en esta categoría por ahora. Atento a los nuevos drops.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-8 px-4 md:px-12 max-w-[1800px] mx-auto pb-12"
            id="catalogo"
        >
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </motion.div>
    );
};

export default ProductGrid;
