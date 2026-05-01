import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; 

const Dashboard = () => {
  // --- State Management ---
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({}); // validation error state
  
  // Modals Toggle
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form Data
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // --- Side Effects ---
  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- API Actions ---

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // POST: Add new customer with Validation
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    
    // വാലിഡേഷൻ ലോജിക്
    let tempErrors = {};
    if (!newCustomer.name) tempErrors.name = "Name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newCustomer.email)) tempErrors.email = "Please enter a valid email";
    
    if (newCustomer.phone.length < 10) tempErrors.phone = "Phone number must be 10 digits";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return; // എറർ ഉണ്ടെങ്കിൽ ഇവിടെ വെച്ച് നിർത്തും
    }

    try {
      const res = await API.post('/customers/add', newCustomer);
      setCustomers([...customers, res.data]);
      setShowModal(false);
      setNewCustomer({ name: '', email: '', phone: '' });
      setErrors({}); // എററുകൾ ക്ലിയർ ചെയ്യും
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add customer. Please check your connection.");
    }
  };

  // PUT: Update existing customer
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/customers/update/${editingCustomer._id}`, editingCustomer);
      setCustomers(customers.map(c => c._id === editingCustomer._id ? res.data : c));
      setShowEditModal(false);
      setEditingCustomer(null);
      setErrors({});
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      try {
        await API.delete(`/customers/delete/${id}`);
        setCustomers(customers.filter(c => c._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete customer.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* 1. SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-slate-300 hidden lg:flex flex-col shadow-2xl">
        <div className="p-8 text-xl font-black text-white tracking-widest uppercase">
          CRM<span className="text-indigo-500">PRO</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium transition shadow-lg shadow-indigo-500/30">
            <span className="mr-3">📊</span> Dashboard
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 2. HEADER */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="px-8 py-5 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
              <p className="text-sm text-slate-500">Welcome back, {user?.name || 'Administrator'}</p>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition">
              Log out
            </button>
          </div>
        </header>

        {/* 3. MAIN TABLE AREA */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl mx-auto w-full">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Customer Directory</h3>
              <button 
                onClick={() => { setErrors({}); setShowModal(true); }}
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
              >
                + Add Customer
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Profile</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan="4" className="py-20 text-center animate-pulse text-slate-400">Loading records...</td></tr>
                  ) : customers.length > 0 ? (
                    customers.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/80 transition group">
                        <td className="px-8 py-5 flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mr-3 flex items-center justify-center font-bold uppercase">
                            {c.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-700">{c.name}</span>
                        </td>
                        <td className="px-8 py-5 text-sm">
                          <div className="text-slate-600 font-medium">{c.email}</div>
                          <div className="text-slate-400">{c.phone}</div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">● Active</span>
                        </td>
                        <td className="px-8 py-5 text-right space-x-2">
                          <button 
                            onClick={() => { setErrors({}); setEditingCustomer(c); setShowEditModal(true); }}
                            className="text-indigo-600 hover:text-indigo-900 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(c._id)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="py-20 text-center text-slate-400">No customers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* --- MODAL: ADD CUSTOMER --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">New Customer</h3>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input 
                  className={`w-full px-4 py-3 rounded-xl border outline-none bg-slate-50 focus:ring-2 focus:ring-indigo-500 mt-1 ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                  value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <input 
                  className={`w-full px-4 py-3 rounded-xl border outline-none bg-slate-50 focus:ring-2 focus:ring-indigo-500 mt-1 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                  value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <input 
                  className={`w-full px-4 py-3 rounded-xl border outline-none bg-slate-50 focus:ring-2 focus:ring-indigo-500 mt-1 ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                  value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-indigo-600 shadow-lg hover:bg-indigo-700 transition">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT CUSTOMER --- */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Edit Profile</h3>
            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:ring-2 focus:ring-indigo-500 mt-1"
                  value={editingCustomer.name} onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:ring-2 focus:ring-indigo-500 mt-1"
                  value={editingCustomer.email} onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:ring-2 focus:ring-indigo-500 mt-1"
                  value={editingCustomer.phone} onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-indigo-600 shadow-lg hover:bg-indigo-700 transition">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;