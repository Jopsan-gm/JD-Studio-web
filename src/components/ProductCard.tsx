import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { MessageCircle, Heart } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
    product: Product;
}

const MotionLink = motion(Link);

const ProductCard = ({ product }: ProductCardProps) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isLoved = isInWishlist(product.id);

    return (
        <MotionLink
            href={`/product/${product.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5 }}
            className="group bg-white overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 rounded-2xl block"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <motion.img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070';
                    }}
                />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 z-30 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:scale-110 group/heart"
                >
                    <Heart
                        className={`w-3.5 h-3.5 transition-colors ${isLoved ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/heart:text-red-400'}`}
                    />
                </button>

                {/* Status Badges */}
                <div className="absolute top-2 left-0 flex flex-col gap-1 z-10">
                    {product.discount_price && (
                        <div className="bg-orange-500 text-white text-[9px] font-extrabold px-2 py-1 uppercase tracking-tight shadow-sm border-y border-r border-orange-600 rounded-r-sm">
                            ¡Oferta!
                        </div>
                    )}
                </div>

                {product.is_sold_out && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 backdrop-blur-[2px]"
                    >
                        <span className="text-white uppercase text-xs font-bold border-2 border-white px-2 py-1 transform -rotate-12 tracking-widest shadow-2xl">
                            Agotado
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Info Container */}
            <div className="p-3">
                <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                <div className="flex flex-col gap-0.5">
                    {product.discount_price ? (
                        <div className="flex items-center gap-1.5">
                            <span className="text-orange-600 font-bold text-lg leading-none">
                                ₡{product.discount_price.toLocaleString()}
                            </span>
                            <span className="text-gray-400 line-through text-[10px]">
                                ₡{product.price.toLocaleString()}
                            </span>
                        </div>
                    ) : (
                        <div className="text-slate-800 font-bold text-lg leading-none">
                            ₡{product.price.toLocaleString()}
                        </div>
                    )}
                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        {product.category}
                    </span>
                </div>

                <motion.div
                    whileHover={{ backgroundColor: '#5A5A5A' }}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-black text-white transition-colors text-xs font-bold uppercase tracking-wider rounded-full"
                >
                    <MessageCircle className="w-4 h-4" />
                    Lo quiero
                </motion.div>
            </div>
        </MotionLink>
    );
};

export default ProductCard;
