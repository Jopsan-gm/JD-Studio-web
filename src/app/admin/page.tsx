'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { products as localProducts } from '@/data/products';

// Simple password protection
const ADMIN_PASSWORD = "golden-admin-2024";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
    const [showConfirm, setShowConfirm] = useState<{ show: boolean; message: string; onConfirm: () => void } | null>(null);
    const [discountModal, setDiscountModal] = useState<{ show: boolean; productId: string; currentPrice: number } | null>(null);
    const [discountInputValue, setDiscountInputValue] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [editModal, setEditModal] = useState<{ show: boolean; product: any } | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Oversize',
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: null }), 3000);
    };

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Oversize',
        images: '',
        discountPrice: '',
    });

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
        }
    }, [isAuthenticated]);

    // Migration function
    const handleMigration = async () => {
        setShowConfirm({
            show: true,
            message: '¿Estás seguro? Esto copiará los productos del código a la base de datos.',
            onConfirm: async () => {
                setShowConfirm(null);
                setLoading(true);
                try {
                    const productsToInsert = localProducts.map(p => ({
                        name: p.name,
                        price: p.price,
                        description: p.description,
                        category: p.category,
                        images: p.images,
                        is_sold_out: false
                    }));

                    const { error } = await supabase.from('products').insert(productsToInsert);
                    if (error) throw error;

                    showToast('¡Productos migrados exitosamente!', 'success');
                    fetchProducts();
                } catch (error: any) {
                    showToast('Error en la migración: ' + error.message, 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            showToast('Contraseña incorrecta', 'error');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        name: formData.name,
                        price: parseFloat(formData.price),
                        description: formData.description,
                        category: formData.category,
                        images: formData.images.split(',').map(url => url.trim()),
                        is_sold_out: false,
                        discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null
                    }
                ]);

            if (error) throw error;

            showToast('Producto creado con éxito!', 'success');
            setFormData({ name: '', price: '', description: '', category: 'Oversize', images: '', discountPrice: '' });
            fetchProducts();
        } catch (error: any) {
            showToast('Error al crear producto: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setShowConfirm({
            show: true,
            message: '¿Estás seguro de eliminar este producto?',
            onConfirm: async () => {
                setShowConfirm(null);
                setLoading(true);
                try {
                    const { error } = await supabase
                        .from('products')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    fetchProducts();
                    showToast('Producto eliminado', 'success');
                } catch (error: any) {
                    showToast('Error al eliminar: ' + error.message, 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleToggleSoldOut = async (id: string, currentStatus: boolean) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_sold_out: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
            showToast('Estado actualizado', 'success');
        } catch (error: any) {
            showToast('Error al actualizar estado: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyDiscount = (id: string, currentPrice: number) => {
        setDiscountModal({ show: true, productId: id, currentPrice });
        setDiscountInputValue('');
    };

    const confirmApplyDiscount = async () => {
        if (!discountModal) return;

        const newPrice = parseFloat(discountInputValue);
        if (isNaN(newPrice)) {
            showToast('Precio no válido', 'error');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('products')
                .update({ discount_price: newPrice })
                .eq('id', discountModal.productId);

            if (error) throw error;
            fetchProducts();
            showToast('Descuento aplicado', 'success');
            setDiscountModal(null);
        } catch (error: any) {
            showToast('Error al aplicar descuento: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDiscount = async (id: string) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('products')
                .update({ discount_price: null })
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
            showToast('Descuento eliminado', 'success');
        } catch (error: any) {
            showToast('Error al eliminar descuento: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product: any) => {
        setEditModal({ show: true, product });
        setEditFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            category: product.category || 'Oversize',
        });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editModal) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    name: editFormData.name,
                    price: parseFloat(editFormData.price),
                    description: editFormData.description,
                    category: editFormData.category,
                })
                .eq('id', editModal.product.id);

            if (error) throw error;
            fetchProducts();
            showToast('Producto actualizado', 'success');
            setEditModal(null);
        } catch (error: any) {
            showToast('Error al actualizar: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const uploadedUrls: string[] = [];

        try {
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                uploadedUrls.push(data.publicUrl);
            }

            const currentImages = formData.images ? formData.images.split(',').map(u => u.trim()).filter(Boolean) : [];
            const newImages = [...currentImages, ...uploadedUrls].join(', ');

            setFormData({ ...formData, images: newImages });
            showToast('¡Imágenes subidas correctamente!', 'success');
        } catch (error: any) {
            showToast('Error al subir imagen: ' + error.message, 'error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-4 pt-16 sm:pt-24">
                <div className="w-full max-w-sm flex flex-col items-center mb-4">
                    <img
                        src="/images/jd-logo.png"
                        alt="JD Studio Logo"
                        className="h-32 sm:h-40 w-auto object-contain select-none filter invert brightness-0"
                    />
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm relative border border-gray-100">
                    <Link
                        href="/"
                        className="absolute top-4 left-4 text-gray-300 hover:text-black transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                    >
                        ← <span className="hidden sm:inline">Volver</span>
                    </Link>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 uppercase tracking-tight">Acceso Admin</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                        <button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 font-bold">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Mobile Header */}
            <div className="bg-white shadow-sm sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Panel Admin v2.0</h1>
                <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold uppercase tracking-widest text-red-500">
                    Salir
                </button>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-8">
                {/* Actions Toolbar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 font-medium">Gestión de Catálogo</p>
                    <button
                        onClick={handleMigration}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
                        disabled={loading}
                    >
                        {loading ? '...' : '↺ Restaurar Backup'}
                    </button>
                </div>

                {/* Create Product Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">＋</span>
                        Nuevo Producto
                    </h2>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition outline-none font-medium"
                                placeholder="Ej. Pantalón Carhartt"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Precio Original</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400 font-bold">₡</span>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full p-3 pl-8 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition outline-none font-bold text-gray-800"
                                        placeholder="8000"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block text-orange-500">Precio Oferta (Opcional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-orange-300 font-bold">₡</span>
                                    <input
                                        type="number"
                                        value={formData.discountPrice}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                        className="w-full p-3 pl-8 bg-orange-50 border-none rounded-lg focus:ring-2 focus:ring-orange-400 transition outline-none font-bold text-orange-700"
                                        placeholder="6500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Categoría</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full p-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition outline-none font-medium text-gray-600 appearance-none bg-no-repeat"
                                >
                                    <option value="Oversize">Oversize (Ropa)</option>
                                    <option value="T-Shirts">T-Shirts (Ropa)</option>
                                    <option value="Pants">Pants (Ropa)</option>
                                    <option value="Hoodies">Hoodies (Ropa)</option>
                                    <option value="Collares">Collares (Bisutería)</option>
                                    <option value="Aretes">Aretes (Bisutería)</option>
                                    <option value="Pulseras">Pulseras (Bisutería)</option>
                                    <option value="Anillos">Anillos (Bisutería)</option>
                                    <option value="Conjuntos">Conjuntos (Bisutería)</option>
                                    <option value="Van Cleef">Van Cleef (Bisutería)</option>
                                </select>
                            </div>
                        </div>



                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition outline-none text-sm text-gray-600"
                                rows={3}
                                placeholder="Detalles de la prenda..."
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Fotos</label>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        ref={fileInputRef}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition flex flex-col items-center justify-center gap-2 active:scale-95 transform duration-100"
                                    >
                                        {uploading ? (
                                            <span className="animate-pulse">Subiendo...</span>
                                        ) : (
                                            <>
                                                <span className="text-2xl">📷</span>
                                                <span className="text-sm">Tocar para subir fotos</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {formData.images && (
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 overflow-x-auto">
                                        {formData.images.split(',').map((img, idx) => img && (
                                            <div key={idx} className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-white border border-gray-200 relative">
                                                <img src={img.trim()} className="w-full h-full object-cover" alt="Selected upload" />
                                            </div>
                                        ))}
                                        {formData.images.split(',').filter(Boolean).length > 0 && (
                                            <span className="text-xs text-gray-400 whitespace-nowrap px-2">
                                                {formData.images.split(',').filter(Boolean).length} fotos seleccionadas
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-black active:scale-95 transition-all duration-200 mt-4 text-sm uppercase tracking-widest"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Publicar Prenda'}
                        </button>
                    </form>
                </div>

                {/* Inventory List */}
                <div>
                    <h2 className="text-lg font-bold mb-4 px-2 text-gray-900">Inventario ({products.length})</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    {product.images && product.images[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">No img</div>
                                    )}
                                    {product.is_sold_out && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white uppercase transform -rotate-12 border border-white px-1">Agotado</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate pr-4">{product.name}</h3>
                                    <div className="flex items-center gap-2">
                                        {product.discount_price ? (
                                            <>
                                                <span className="text-orange-600 font-bold text-sm">₡{product.discount_price.toLocaleString()}</span>
                                                <span className="text-gray-400 line-through text-[10px]">₡{product.price.toLocaleString()}</span>
                                            </>
                                        ) : (
                                            <span className="text-vintage-gold font-bold text-sm">₡{product.price.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">{product.category}</p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <button
                                            onClick={() => handleToggleSoldOut(product.id, product.is_sold_out)}
                                            className={`flex-1 min-w-[120px] py-1.5 px-3 rounded-md text-xs font-bold text-center transition ${product.is_sold_out
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}
                                        >
                                            {product.is_sold_out ? 'Marcar Disponible' : 'Marcar Agotado'}
                                        </button>

                                        {product.discount_price ? (
                                            <button
                                                onClick={() => handleRemoveDiscount(product.id)}
                                                className="flex-1 min-w-[100px] py-1.5 px-3 bg-orange-100 text-orange-600 rounded-md text-xs font-bold"
                                            >
                                                Quitar Oferta
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleApplyDiscount(product.id, product.price)}
                                                className="flex-1 min-w-[100px] py-1.5 px-3 bg-vintage-gold/10 text-vintage-gold rounded-md text-xs font-bold"
                                            >
                                                % Descuento
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-500 rounded-md text-xs font-bold"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="px-3 py-1.5 bg-red-50 text-red-500 rounded-md text-xs font-bold"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                <p>No hay productos en el inventario.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Notification Toast */}
            {notification.message && (
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl text-white font-bold transition-all transform animate-bounce-short ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                    {notification.message}
                </div>
            )}

            {/* Custom Confirmation Modal */}
            {showConfirm?.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform animate-scale-in">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">¿Confirmar acción?</h3>
                        <p className="text-gray-500 mb-6">{showConfirm.message}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(null)}
                                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold active:scale-95 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={showConfirm.onConfirm}
                                className="flex-1 py-3 bg-black text-white rounded-xl font-bold active:scale-95 transition"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Discount Modal */}
            {discountModal?.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform animate-scale-in border border-gray-100">
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
                            🏷️
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 text-center">Aplicar Descuento</h3>
                        <p className="text-gray-500 mb-8 text-center text-sm">
                            El precio actual es <span className="font-bold text-gray-800 text-base block mt-1">₡{discountModal.currentPrice.toLocaleString()}</span>
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                                    Nuevo Precio en Oferta
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 font-bold text-xl group-focus-within:scale-110 transition-transform">₡</span>
                                    <input
                                        autoFocus
                                        type="number"
                                        value={discountInputValue}
                                        onChange={(e) => setDiscountInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && confirmApplyDiscount()}
                                        placeholder="0"
                                        className="w-full bg-orange-50/50 border-2 border-orange-100 focus:border-orange-500 focus:bg-white p-4 pl-10 rounded-2xl outline-none transition-all font-bold text-2xl text-orange-700 placeholder:text-orange-200"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setDiscountModal(null)}
                                    className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 hover:text-gray-600 active:scale-95 transition-all text-sm uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmApplyDiscount}
                                    disabled={loading || !discountInputValue}
                                    className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-[0_8px_20px_rgba(234,88,12,0.3)] hover:bg-orange-700 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50 disabled:shadow-none"
                                >
                                    {loading ? 'Aplicando...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Edit Modal */}
            {editModal?.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform animate-scale-in border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Editar Producto</h3>
                            <button onClick={() => setEditModal(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nombre</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition outline-none font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Precio Original</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400 font-bold">₡</span>
                                    <input
                                        type="number"
                                        value={editFormData.price}
                                        onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                        className="w-full p-3 pl-8 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition outline-none font-bold text-gray-800"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Categoría</label>
                                <select
                                    value={editFormData.category}
                                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition outline-none font-medium text-gray-600 appearance-none bg-no-repeat"
                                >
                                    <option value="Oversize">Oversize (Ropa)</option>
                                    <option value="T-Shirts">T-Shirts (Ropa)</option>
                                    <option value="Pants">Pants (Ropa)</option>
                                    <option value="Hoodies">Hoodies (Ropa)</option>
                                    <option value="Collares">Collares (Bisutería)</option>
                                    <option value="Aretes">Aretes (Bisutería)</option>
                                    <option value="Pulseras">Pulseras (Bisutería)</option>
                                    <option value="Anillos">Anillos (Bisutería)</option>
                                    <option value="Conjuntos">Conjuntos (Bisutería)</option>
                                    <option value="Van Cleef">Van Cleef (Bisutería)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Descripción</label>
                                <textarea
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-black transition outline-none text-sm text-gray-600"
                                    rows={3}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-black active:scale-95 transition-all duration-200 mt-4 text-sm uppercase tracking-widest"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
