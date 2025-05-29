import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Users, Package, Mail, DollarSign } from 'lucide-react';

function App() {
  const userApi = process.env.REACT_APP_USER_SERVICE_URL;
  const productApi = process.env.REACT_APP_PRODUCT_SERVICE_URL;

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [userForm, setUserForm] = useState({ name: '', email: '' });
  const [productForm, setProductForm] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [userServiceDown, setUserServiceDown] = useState(false);
  const [productServiceDown, setProductServiceDown] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch data when switching tabs (to show correct error)
  useEffect(() => {
    if (users.length === 0 && products.length === 0) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchData = async () => {
    setErrorMsg('');
    setLoading(true);
    setUserServiceDown(false);
    setProductServiceDown(false);

    try {
      const [userRes, productRes] = await Promise.allSettled([
        axios.get(`${userApi}/users`),
        axios.get(`${productApi}/products`),
      ]);

      // Handle users response
      if (userRes.status === 'fulfilled') {
        setUsers(userRes.value.data);
      } else {
        setUsers([]);
        setUserServiceDown(true);
        if (activeTab === 'users') setErrorMsg('User service is down. Users data unavailable.');
      }

      // Handle products response
      if (productRes.status === 'fulfilled') {
        setProducts(productRes.value.data);
      } else {
        setProducts([]);
        setProductServiceDown(true);
        if (activeTab === 'products') setErrorMsg('Product service is down. Products data unavailable.');
      }

      // Show generic error if both failed
      if (userRes.status !== 'fulfilled' && productRes.status !== 'fulfilled') {
        setErrorMsg('Both User and Product services are down.');
      }
    } catch (error) {
      setErrorMsg('Unexpected error! Please try again.');
      setUsers([]);
      setProducts([]);
      setUserServiceDown(true);
      setProductServiceDown(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) {
      setErrorMsg('Please enter a valid name and email.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await axios.post(`${userApi}/users`, userForm);
      setUserForm({ name: '', email: '' });
      await fetchData();
    } catch (error) {
      setErrorMsg('Failed to add user. User service may be down.');
      setUserServiceDown(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setErrorMsg('');
    setLoading(true);
    try {
      await axios.delete(`${userApi}/users/${id}`);
      await fetchData();
    } catch (error) {
      setErrorMsg('Failed to delete user. User service may be down.');
      setUserServiceDown(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.name.trim() || !productForm.price || Number(productForm.price) <= 0) {
      setErrorMsg('Please enter a valid product name and price.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await axios.post(`${productApi}/products`, {
        name: productForm.name.trim(),
        price: Number(productForm.price),
      });
      setProductForm({ name: '', price: '' });
      await fetchData();
    } catch (error) {
      setErrorMsg('Failed to add product. Product service may be down.');
      setProductServiceDown(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setErrorMsg('');
    setLoading(true);
    try {
      await axios.delete(`${productApi}/products/${id}`);
      await fetchData();
    } catch (error) {
      setErrorMsg('Failed to delete product. Product service may be down.');
      setProductServiceDown(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-1">Dashboard</h1>
          <p className="text-purple-300">Manage your users and products efficiently</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <nav className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-blue-600 shadow-lg shadow-blue-600/50'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-pressed={activeTab === 'users'}
          >
            <Users size={20} />
            Users
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'products'
                ? 'bg-emerald-600 shadow-lg shadow-emerald-600/50'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-pressed={activeTab === 'products'}
          >
            <Package size={20} />
            Products
          </button>
        </nav>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 rounded-md bg-red-700 bg-opacity-70 p-4 text-center text-white font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-white"></div>
              <p className="text-white text-lg">Loading...</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {/* Add User Form */}
            <section className="mb-10 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="text-blue-400" size={28} />
                Add New User
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddUser();
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                    disabled={userServiceDown}
                  />
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                    disabled={userServiceDown}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <button
                  type="submit"
                  disabled={loading || userServiceDown}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                >
                  <Plus size={20} />
                  Add User
                </button>
              </form>
              {userServiceDown && (
                <div className="mt-2 text-red-400 text-center font-semibold">
                  User service unavailable.
                </div>
              )}
            </section>

            {/* Users List */}
            <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Users ({users.length})
              </h3>
              {userServiceDown ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="mx-auto mb-4" size={48} />
                  <p>User service is unavailable. Cannot fetch users.</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="mx-auto mb-4" size={48} />
                  <p>No users yet. Add your first user above!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {users.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-gray-300 text-sm">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={loading || userServiceDown}
                        aria-label={`Delete user ${user.name}`}
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-600/20 rounded-lg transition-all duration-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {/* Add Product Form */}
            <section className="mb-10 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Package className="text-emerald-400" size={28} />
                Add New Product
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddProduct();
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    required
                    disabled={productServiceDown}
                  />
                  <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter price"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    required
                    disabled={productServiceDown}
                  />
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <button
                  type="submit"
                  disabled={loading || productServiceDown}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </form>
              {productServiceDown && (
                <div className="mt-2 text-red-400 text-center font-semibold">
                  Product service unavailable.
                </div>
              )}
            </section>

            {/* Products List */}
            <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Products ({products.length})
              </h3>
              {productServiceDown ? (
                <div className="text-center py-12 text-gray-400">
                  <Package className="mx-auto mb-4" size={48} />
                  <p>Product service is unavailable. Cannot fetch products.</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package className="mx-auto mb-4" size={48} />
                  <p>No products available. Add your first product above!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {products.map((product) => (
                    <li
                      key={product._id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-gray-300 text-sm">${product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={loading || productServiceDown}
                        aria-label={`Delete product ${product.name}`}
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-600/20 rounded-lg transition-all duration-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="text-center py-6 text-gray-400 select-none">
        &copy; 2025 Your Company. All rights reserved.
      </footer>
    </div>
  );
}

export default App; 