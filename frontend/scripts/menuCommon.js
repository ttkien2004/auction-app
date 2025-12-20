document.addEventListener("DOMContentLoaded", () => {
	const menuSidebar = document.getElementById("menu-sidebar");
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	if (user.Buyer) {
		menuSidebar.innerHTML = `
        <a href="../profile/index.html" class="sidebar-link active"
            >Tài khoản của tôi</a
        >
        <a href="../buy-list/index.html" class="sidebar-link"
            >Danh sách mua</a
        >
        <a href="#" class="sidebar-link logout">Đăng xuất</a>
        `;
	} else if (user.Seller) {
		menuSidebar.innerHTML = `
        <a href="../profile/index.html" class="sidebar-link"
						>Tài khoản của tôi</a
        >
        <a href="../membership/index.html" class="sidebar-link sub-item"
						>Hồ sơ uy tín</a
        >
        <a href="#" class="sidebar-link logout">Đăng xuất</a>
        `;
	}
	const currentPath = window.location.pathname;

	document.querySelectorAll("#menu-sidebar a").forEach((link) => {
		let linkPath = link.getAttribute("href");

		// Chuẩn hóa path để so sánh đúng
		if (currentPath.endsWith(linkPath.replace("../", ""))) {
			link.classList.add("active");
		} else {
			link.classList.remove("active");
		}
	});
});
