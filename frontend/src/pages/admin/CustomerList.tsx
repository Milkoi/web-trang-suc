import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import './AdminLayout.css';

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
}

const CustomerList: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get('search') || '';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'customer' as 'admin' | 'customer',
    isActive: true
  });

  useEffect(() => {
    fetchCustomers();
  }, [searchKeyword]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const endpoint = searchKeyword ? `/customers/search?query=${encodeURIComponent(searchKeyword)}` : '/customers/users';
      const response = await api.get(endpoint);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone || '',
      role: customer.role,
      isActive: customer.isActive
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      await api.put(`/customers/${editingCustomer.id}`, formData);
      setShowEditModal(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Có lỗi xảy ra khi cập nhật khách hàng');
    }
  };

  const handleToggleStatus = async (customer: Customer) => {
    try {
      await api.patch(`/customers/${customer.id}/toggle-status`);
      fetchCustomers();
    } catch (error) {
      console.error('Error toggling customer status:', error);
      alert('Có lỗi xảy ra khi thay đổi trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Có lỗi xảy ra khi xóa khách hàng');
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Quản lý Khách hàng</h2>
        <div className="admin-header__actions">
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ width: '300px' }}
          />
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Tổng đơn hàng</th>
              <th>Tổng chi tiêu</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{customer.fullName}</div>
                    <div className="customer-email">{customer.email}</div>
                  </div>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone || '-'}</td>
                <td>
                  <span className={`role ${customer.role}`}>
                    {customer.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </span>
                </td>
                <td>{customer.totalOrders || 0}</td>
                <td>{customer.totalSpent ? formatCurrency(customer.totalSpent) : '0₫'}</td>
                <td>
                  <span className={`status ${customer.isActive ? 'active' : 'inactive'}`}>
                    {customer.isActive ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="btn-icon"
                      onClick={() => handleEdit(customer)}
                    >
                      Sửa
                    </button>
                    <button 
                      className={`btn-icon ${customer.isActive ? 'delete' : ''}`}
                      onClick={() => handleToggleStatus(customer)}
                    >
                      {customer.isActive ? 'Khóa' : 'Mở'}
                    </button>
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && editingCustomer && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <button className="admin-modal-close" onClick={() => setShowEditModal(false)}>×</button>
            <h3>Chỉnh sửa thông tin Khách hàng</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'customer'})}
                >
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Tài khoản hoạt động
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
