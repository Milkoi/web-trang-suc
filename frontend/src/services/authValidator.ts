export const authValidator = {
  validateLogin: (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, message: "Vui lòng nhập đầy đủ email và mật khẩu!" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Định dạng email không hợp lệ!" };
    }

    return { success: true };
  },

  validateRegister: (data: any) => {
    const { name, email, password, confirmPassword } = data;

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, message: "Vui lòng điền đầy đủ thông tin!" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Email không hợp lệ!" };
    }

    if (password.length < 6) {
      return { success: false, message: "Mật khẩu phải từ 6 ký tự trở lên!" };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Mật khẩu xác nhận không khớp!" };
    }

    return { success: true };
  },
};
