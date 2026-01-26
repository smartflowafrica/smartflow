'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, AlertTriangle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AddProductModal } from '@/components/client/inventory/AddProductModal';
import { useSession } from 'next-auth/react';

import { EditProductModal } from '@/components/client/inventory/EditProductModal';

interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    cost: number;
    quantity: number;
    lowStockThreshold: number;
    isActive: boolean;
}

export default function InventoryPage() {
    const { data: session } = useSession();
    const canManageInventory = session?.user?.staffRole === 'OWNER' || session?.user?.staffRole === 'MANAGER';

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/inventory');
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load inventory');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will remove the item from active inventory.')) return;
        try {
            const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Product removed');
                fetchProducts();
            } else {
                toast.error('Failed to delete');
            }
        } catch (e) {
            toast.error('Error deleting product');
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Package className="text-blue-600" />
                        Inventory
                    </h1>
                    <p className="text-slate-500">Track parts, stock levels, and costs</p>
                </div>
                {canManageInventory && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus size={20} />
                        <span>Add Product</span>
                    </button>
                )}
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProducts}
            />

            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchProducts}
                product={selectedProduct}
            />

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name, SKU, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                    <Filter size={20} />
                    <span>Filter</span>
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto pb-20">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Product</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Stock Level</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Price (Selling)</th>
                                {canManageInventory && <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading inventory...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No products found. Add your first item!</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const isLowStock = product.quantity <= product.lowStockThreshold;
                                    return (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-slate-900">{product.name}</div>
                                                    {product.sku && <div className="text-xs text-slate-500 font-mono">SKU: {product.sku}</div>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.category ? (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                                                        {product.category}
                                                    </span>
                                                ) : <span className="text-slate-400 text-sm">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
                                                        {product.quantity}
                                                    </span>
                                                    {isLowStock && (
                                                        <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                                                            <AlertTriangle size={12} /> Low Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 font-medium">
                                                ₦{product.price.toLocaleString()}
                                            </td>
                                            {canManageInventory && (
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
