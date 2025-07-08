import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Constants
const API_BASE_URL = "http://localhost:3000/api";
const ROLES = {
  USER: "user",
  ADMIN: "admin"
};

export default function UserList() {
  // State declarations
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();

  // Helper functions
  const getToken = () => localStorage.getItem("token");
  
  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() <= payload.exp * 1000;
    } catch {
      return false;
    }
  };

  const getUserRole = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const redirectToLogin = (message) => {
    toast.error(message);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const createAuthHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // API calls
  const fetchUsers = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    const token = getToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: createAuthHeaders(token),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("User berhasil diperbarui");
      setShowModal(false);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userData.id ? userData : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Gagal memperbarui user");
    }
  };

  const deleteUser = async (userId) => {
    const token = getToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("User berhasil dihapus");
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Gagal menghapus user");
    }
  };

  // Event handlers
  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      updateUser(selectedUser);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      deleteUser(userId);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleInputChange = (field, value) => {
    setSelectedUser(prev => ({ ...prev, [field]: value }));
  };

  // Effects
  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      return redirectToLogin("Token tidak ditemukan");
    }

    if (!isTokenValid(token)) {
      return redirectToLogin("Token kadaluarsa");
    }

    const userRole = getUserRole(token);
    if (userRole !== ROLES.ADMIN) {
      return redirectToLogin("Akses hanya untuk admin");
    }

    fetchUsers(token);
  }, [navigate]);

  // Render helpers
  const renderTableRow = (user, index) => (
    <tr key={user.id} className="text-center hover:bg-gray-50">
      <td className="border px-3 py-2">{index + 1}</td>
      <td className="border px-3 py-2">{user.name}</td>
      <td className="border px-3 py-2">{user.phone || "-"}</td>
      <td className="border px-3 py-2">{user.email}</td>
      <td className="border px-3 py-2 capitalize">{user.role}</td>
      <td className="border px-3 py-2 space-x-2">
        <button
          onClick={() => handleEditClick(user)}
          className="text-yellow-500 hover:text-yellow-600 font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Hapus
        </button>
      </td>
    </tr>
  );

  const renderModal = () => {
    if (!showModal || !selectedUser) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          
          <div className="space-y-3">
            <input
              type="text"
              value={selectedUser.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama"
            />
            
            <input
              type="email"
              value={selectedUser.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
            
            <input
              type="text"
              value={selectedUser.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nomor HP"
            />
            
            <select
              value={selectedUser.role || ROLES.USER}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={ROLES.USER}>User</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>
          
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">Daftar User</h1>

        {loading ? (
          <Skeleton className="w-full h-32 rounded-lg" />
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada user yang terdaftar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-3 py-2">No.</th>
                  <th className="border px-3 py-2">Nama</th>
                  <th className="border px-3 py-2">Nomor HP</th>
                  <th className="border px-3 py-2">Email</th>
                  <th className="border px-3 py-2">Role</th>
                  <th className="border px-3 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(renderTableRow)}
              </tbody>
            </table>
          </div>
        )}

        {renderModal()}
      </main>
    </div>
  );
}