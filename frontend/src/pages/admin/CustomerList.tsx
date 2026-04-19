import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './CustomerList.css';

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'customer',
    isActive: true
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/statistics/customers?period=year');
      const customersData = response.data.topCustomers.map((customer: any) => ({
        ...customer,
        isActive: true,
        phone: '',
        createdAt: new Date().toISOString()
      }));
      
      // Get all customers basic info
      const allCustomersResponse = await api.get('/account/users');
      const allCustomers = allCustomersResponse.data;
      
      // Merge customer stats with basic info
      const mergedCustomers = allCustomers.map((customer: any) => {
        const stats = customersData.find((stat: any) => stat.userId === customer.id);
        return {
          ...customer,
          totalOrders: stats?.totalOrders || 0,
          totalSpent: stats?.totalSpent || 0
        };
      });
      
      setCustomers(mergedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/account/users/${editingCustomer.id}`, formData);
      }
      
      fetchCustomers();
      setShowEditModal(false);
      setEditingCustomer(null);
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi lưu thông tin khách hàng');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: 'customer',
      isActive: true
    });
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

  const handleToggleStatus = async (customer: Customer) => {
    try {
      await api.put(`/account/users/${customer.id}`, {
        isActive: !customer.isActive
      });
      fetchCustomers();
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái khách hàng');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await api.delete(`/account/users/${id}`);
        fetchCustomers();
      } catch (error) {
        alert('Lỗi khi xóa khách hàng');
      }
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;

  return (
    <div className="customer-list">
      <div className="customer-list__header">
        <h1>Quản lý Khách hàng</h1>
        <div className="customer-list__actions">
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="customer-list__content">
        <div className="customer-table">
          <table>
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
                    <div className="customer-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(customer)}
                      >
                        Sửa
                      </button>
                      <button 
                        className={`btn-toggle ${customer.isActive ? 'btn-lock' : 'btn-unlock'}`}
                        onClick={() => handleToggleStatus(customer)}
                      >
                        {customer.isActive ? 'Khóa' : 'Mở'}
                      </button>
                      <button 
                        className="btn-delete"
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
      </div>

      {/* Edit Modal */}
      {showEditModal && editingCustomer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chỉnh sửa thông tin Khách hàng</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="customer-form">
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
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
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
