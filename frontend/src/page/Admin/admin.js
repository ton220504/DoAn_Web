import React from 'react';

const AdminPage = () => {
  return (
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50',fontSize:"55px" }}>Chào mừng bạn đến với trang admin</h1>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
        Trang này cung cấp các công cụ để quản lý người dùng, theo dõi hệ thống và tùy chỉnh nội dung.
      </p>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
        Bạn có thể sử dụng trang admin để thêm, sửa hoặc xóa dữ liệu, giám sát hiệu suất hệ thống và kiểm tra thông tin người dùng.
      </p>
    </div>
  );
}

export default AdminPage;