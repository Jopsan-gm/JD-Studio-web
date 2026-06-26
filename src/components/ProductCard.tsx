import { Product } from '@/types/product';
import { MessageCircle, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart, removeFromCart, isInCart } = useCart();
    const isLoved = isInWishlist(product.id);
    const inCart = isInCart(product.id);

    return (
        <Link
            href={`/product/${product.id}`}
            className="group bg-[#121215] border border-zinc-900/80 hover:border-[#C5FF30]/40 transition-all duration-300 rounded-xl block hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:-translate-y-1 overflow-hidden"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070';
                    }}
                />

                {/* Wishlist Button */}
                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-black hover:bg-[#C5FF30] hover:border-[#C5FF30] transition-all hover:scale-105 active:scale-95 group/heart"
                >
                    <Heart
                        className={`w-3.5 h-3.5 transition-all ${isLoved ? 'fill-[#C5FF30] text-[#C5FF30] group-hover/heart:fill-black group-hover/heart:text-black' : 'text-zinc-400 group-hover/heart:text-black'}`}
                    />
                </button>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {product.discount_price && (
                        <div className="bg-[#C5FF30] text-black text-[9px] font-black px-2.5 py-1 uppercase tracking-wider shadow-md rounded-sm">
                            OFERTA
                        </div>
                    )}
                </div>

                {product.is_sold_out && (
                    <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-20 backdrop-blur-[2px] pointer-events-none">
                        <span className="text-[#FF3E3E] uppercase text-[10px] font-mono font-black border-2 border-[#FF3E3E] px-3 py-1.5 transform -rotate-6 tracking-widest shadow-[0_0_20px_rgba(255,62,62,0.15)] bg-black/60 rounded-sm">
                            OUT OF STOCK
                        </span>
                    </div>
                )}
            </div>

            {/* Info Container */}
            <div className="p-4 flex flex-col justify-between min-h-[168px]">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] md:text-xs text-[#C5FF30] font-mono uppercase tracking-[0.2em] font-bold">
                            {product.category}
                        </span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (inCart) {
                                    removeFromCart(product.id);
                                } else {
                                    addToCart(product);
                                }
                            }}
                            className={`p-2 rounded-md transition-all hover:scale-105 active:scale-95 group/cart ${
                                inCart 
                                    ? 'bg-[#C5FF30] text-black' 
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-black hover:bg-[#C5FF30] hover:border-[#C5FF30]'
                            }`}
                            title={inCart ? "Quitar del carrito" : "Agregar al carrito"}
                        >
                            <ShoppingBag
                                className={`w-4 h-4 transition-all ${inCart ? 'text-black' : 'text-zinc-400 group-hover/cart:text-black'}`}
                            />
                        </button>
                    </div>
                    <h3 className="text-sm md:text-base font-sans font-bold text-zinc-100 group-hover:text-[#C5FF30] line-clamp-2 leading-snug transition-colors duration-300 min-h-[2.5rem]">
                        {product.name}
                    </h3>
                </div>

                <div className="mt-3 flex flex-col gap-3">
                    <div className="flex items-baseline gap-2">
                        {product.discount_price ? (
                            <div className="flex items-baseline gap-2 font-mono">
                                <span className="text-white font-extrabold text-base md:text-lg">
                                    ₡{product.discount_price.toLocaleString()}
                                </span>
                                <span className="text-zinc-500 line-through text-[11px]">
                                    ₡{product.price.toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <div className="text-white font-mono font-extrabold text-base md:text-lg">
                                ₡{product.price.toLocaleString()}
                            </div>
                        )}
                    </div>
                    <div
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C5FF30] text-black hover:bg-[#b5eb29] transition-all duration-300 text-xs font-black uppercase tracking-widest rounded-lg shadow-lg shadow-[#C5FF30]/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98] md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
                    >
                        <MessageCircle className="w-4 h-4 stroke-[3]" />
                        Lo quiero
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
