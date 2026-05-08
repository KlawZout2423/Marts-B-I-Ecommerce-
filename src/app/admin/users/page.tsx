"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Mail, 
  Shield, 
  ShieldCheck, 
  Trash2, 
  ExternalLink,
  User as UserIcon,
  Filter
} from "lucide-react";
import styles from "../AdminPages.module.css";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  _count: {
    sessions: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Change ${user.email} to ${newRole}?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role: newRole })
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        toast.success(`User role updated to ${newRole}`);
      }
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This will revoke all access.")) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success("User deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <h1>User Management</h1>
          <p>Manage customers, staff permissions, and account security.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className={styles.kpiSmall}>
            <span>Total Customers</span>
            <strong>{users.length}</strong>
          </div>
          <div className={styles.kpiSmall}>
            <span>Admins</span>
            <strong>{users.filter(u => u.role === 'admin').length}</strong>
          </div>
        </div>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <div className={styles.searchBar}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className={styles.dateSelector}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                      }}>
                        {user.image ? <img src={user.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={20} color="#94a3b8" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name || "Anonymous User"}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                      background: user.role === 'admin' ? '#f0f9ff' : '#f8fafc',
                      color: user.role === 'admin' ? '#0ea5e9' : '#64748b',
                      border: `1px solid ${user.role === 'admin' ? '#bae6fd' : '#e2e8f0'}`
                    }}>
                      {user.role === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>Active</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className={styles.iconBtn} 
                        onClick={() => toggleRole(user)}
                        title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                      >
                        {user.role === 'admin' ? <Shield size={18} /> : <ShieldCheck size={18} />}
                      </button>
                      <button 
                        className={styles.iconBtn} 
                        onClick={() => deleteUser(user.id)}
                        style={{ color: '#ef4444' }}
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <Users size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p>No users found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
