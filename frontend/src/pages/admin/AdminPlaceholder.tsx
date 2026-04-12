import React from 'react';

const AdminPlaceholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid #ebebeb' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '16px' }}>{title}</h2>
      <p style={{ color: 'var(--color-muted)' }}>Tính năng này đang được phát triển. Vui lòng quay lại sau.</p>
    </div>
  );
};

export default AdminPlaceholder;
