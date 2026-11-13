import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  X, 
  Package, 
  Check, 
  Loader2, 
  Image as ImageIcon 
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Form State for New Product
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    description: '',
    details: '',
    gender: 'MEN',
    categoryId: '',
    originalPrice: 4999,
    sellingPrice: 3999,
    discountPercent: 20,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', isThumbnail: true },
    ],
    variants: [
      { size: 'M', colorName: 'Crisp Ivory', colorHex: '#FBFBFA', quantity: 20, lowStockThreshold: 5 },
      { size: 'L', colorName: 'Crisp Ivory', colorHex: '#FBFBFA', quantity: 15, lowStockThreshold: 5 },
      { size: 'M', colorName: 'Midnight Navy', colorHex: '#1B263B', quantity: 18, lowStockThreshold: 5 },
    ],
  });

  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        api.get('/products?limit=50'),
        api.get('/categories'),
      ]);

      if (prodRes.status === 'fulfilled') {
        setProducts(prodRes.value.data?.data?.products || []);
      }
      if (catRes.status === 'fulfilled') {
        const fetchedCats = catRes.value.data?.data?.categories || [];
        setCategories(fetchedCats);
        if (fetchedCats.length > 0 && !newProduct.categoryId) {
          setNewProduct((prev) => ({ ...prev, categoryId: fetchedCats[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you wish to permanently remove this silhouette?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setActionSuccess('Product removed from catalog.');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionSuccess('');

    try {
      await api.post('/admin/products', newProduct);
      setActionSuccess('New silhouette created and published to live catalog.');
      setShowAddModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Validation error while creating silhouette.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[#A58256] text-xs font-semibold tracking-[0.25em] uppercase">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#141416] mt-1">
            Atelier Products & Variant Inventory
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-[#141416] text-[#EFECE6] text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A880] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Silhouette</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 border border-[#EAE6DF] max-w-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full bg-[#FAF9F5] border border-[#D5D0C6] py-2 pl-9 pr-3 text-xs text-[#141416] focus:outline-none focus:border-[#C5A880]"
          />
          <Search className="w-4 h-4 text-[#8A8A93] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#EAE6DF] shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D5D0C6] text-[#A58256] uppercase text-[10px] tracking-wider bg-[#F2EFE9]/40">
                <th className="py-3 px-4">Silhouette</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Variants / Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DF] text-[#141416]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#71717A]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C5A880] mb-2" />
                    Loading collection data...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const totalStock = p.variants?.reduce((acc, v) => acc + (v.stock || 0), 0);
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-12 h-16 object-cover bg-neutral-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-gray-500">{p.category?.name}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-xs">{p.sku}</td>
                      <td className="py-3.5 px-4 font-medium">{p.gender}</td>
                      <td className="py-3.5 px-4 font-bold">
                        ₹{p.sellingPrice?.toLocaleString('en-IN')}
                        {p.originalPrice > p.sellingPrice && (
                          <span className="text-[10px] text-gray-400 block line-through">
                            ₹{p.originalPrice?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-semibold ${totalStock <= 5 ? 'text-amber-700' : 'text-green-800'}`}>
                          {totalStock} pieces
                        </span>
                        <p className="text-[10px] text-gray-500">
                          {p.variants?.length} unique variants
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded">
                          ACTIVE
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-700 hover:text-red-900 p-1"
                          title="Delete Silhouette"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No products found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF9F5] max-w-2xl w-full p-6 sm:p-8 border border-[#EAE6DF] shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#EAE6DF] pb-4">
              <div>
                <span className="text-[#A58256] text-[10px] font-semibold tracking-widest uppercase">
                  ATELIER CREATION
                </span>
                <h3 className="font-serif text-xl font-bold text-[#141416]">
                  Add New Silhouette
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#141416] font-semibold block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Mulberry Silk Evening Gown"
                    className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="text-[#141416] font-semibold block mb-1">Unique SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
                    placeholder="e.g. MOD-WDR-009"
                    className="w-full bg-white border border-[#D5D0C6] p-2.5 font-mono focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="text-[#141416] font-semibold block mb-1">Gender *</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="MEN">Men</option>
                    <option value="WOMEN">Women</option>
                    <option value="UNISEX">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#141416] font-semibold block mb-1">Category *</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.gender})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#141416] font-semibold block mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="text-[#141416] font-semibold block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#141416] font-semibold block mb-1">Editorial Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Hand-stitched tailoring description..."
                    className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#141416] font-semibold block mb-1">Fabric & Sourcing Details</label>
                  <input
                    type="text"
                    value={newProduct.details}
                    onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
                    placeholder="e.g. 100% Egyptian Giza Cotton | Handwash cold | Made in India"
                    className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Product Image URL Input */}
              <div>
                <label className="text-[#141416] font-semibold block mb-1">Primary Photograph URL *</label>
                <input
                  type="url"
                  required
                  value={newProduct.images[0]?.url || ''}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    images: [{ url: e.target.value, isThumbnail: true, displayOrder: 0 }],
                  })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-[#D5D0C6] p-2.5 focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Status toggles */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                    className="accent-[#C5A880]"
                  />
                  <span>Featured Piece</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isNewArrival}
                    onChange={(e) => setNewProduct({ ...newProduct, isNewArrival: e.target.checked })}
                    className="accent-[#C5A880]"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isBestSeller}
                    onChange={(e) => setNewProduct({ ...newProduct, isBestSeller: e.target.checked })}
                    className="accent-[#C5A880]"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE6DF]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-100 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#141416] text-[#EFECE6] uppercase tracking-wider font-semibold hover:bg-[#C5A880] transition-colors"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Silhouette'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

