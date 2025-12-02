// 1. Import các service API
// (Đảm bảo đường dẫn này đúng, tính từ app.js đến file service)
import authApi from "../services/authApi.js";

// 2. Chờ DOM load xong
document.addEventListener("DOMContentLoaded", () => {
	// Lấy các phần tử (element)
	const loginForm = document.getElementById("login-form");
	const registerForm = document.getElementById("register-form");
	const messageContainer = document.getElementById("message-container");

	// 3. Xử lý Form Đăng Nhập
	if (loginForm) {
		loginForm.addEventListener("submit", async (e) => {
			e.preventDefault(); // Ngăn form reload trang

			// Lấy giá trị từ form
			const email = document.getElementById("login-email").value;
			const password = document.getElementById("login-password").value;

			try {
				// Gọi API
				const data = await authApi.login({ email, password });

				// Lưu token (quan trọng)
				localStorage.setItem("token", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));

				// Thông báo thành công và redirect (ví dụ)
				showMessage("Đăng nhập thành công!", "success");

				// Chuyển hướng đến trang chủ (hoặc trang profile) sau 1 giây
				setTimeout(() => {
					window.location.href = "/frontend/index.html"; // Hoặc trang bạn muốn
				}, 1000);
			} catch (error) {
				// Hiển thị lỗi
				showMessage(
					error.message || "Đăng nhập thất bại. Vui lòng thử lại.",
					"danger"
				);
			}
		});
	}

	// 4. Xử lý Form Đăng Ký
	if (registerForm) {
		registerForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			// Lấy giá trị từ form
			const userData = {
				username: document.getElementById("reg-username").value,
				full_name: document.getElementById("reg-fullname").value,
				email: document.getElementById("reg-email").value,
				password: document.getElementById("reg-password").value,
			};

			try {
				// Gọi API
				const data = await authApi.register(userData);

				// Thông báo thành công
				showMessage(
					"Đăng ký thành công! Bạn có thể đăng nhập ngay bây.",
					"success"
				);

				// (Tùy chọn) Tự động chuyển sang tab đăng nhập
				// document.getElementById('login-tab').click();

				// Xóa rỗng form
				registerForm.reset();
			} catch (error) {
				// Hiển thị lỗi
				showMessage(
					error.message || "Đăng ký thất bại. Vui lòng thử lại.",
					"danger"
				);
			}
		});
	}

	/**
	 * Hàm helper để hiển thị thông báo
	 * @param {string} message - Nội dung thông báo
	 * @param {'success' | 'danger'} type - Loại thông báo (dùng class của Bootstrap)
	 */
	function showMessage(message, type = "danger") {
		messageContainer.innerHTML = `
            <div class="alert alert-${type}" role="alert">
                ${message}
            </div>
        `;
	}
});
