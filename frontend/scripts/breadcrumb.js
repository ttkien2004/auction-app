// scripts/breadcrumb.js

/**
 * CẤU HÌNH ĐƯỜNG DẪN (SITEMAP)
 * Định nghĩa cha-con cho từng trang tại đây
 */
const sitemap = {
	// Trang Hồ sơ uy tín
	"/membership/index.html": {
		title: "Hồ sơ uy tín",
		parents: [
			{ name: "Trang chủ", link: "../index.html" },
			{ name: "Tài khoản của tôi", link: "../profile/index.html" },
		],
	},
	// Trang Danh sách bán
	"/sell-list/index.html": {
		title: "Danh sách bán",
		parents: [
			{ name: "Trang chủ", link: "../index.html" },
			{ name: "Tài khoản của tôi", link: "../profile/index.html" },
		],
	},
	// Trang Danh sách mua
	"/buy-list/index.html": {
		title: "Danh sách mua",
		parents: [
			{ name: "Trang chủ", link: "../index.html" },
			{ name: "Tài khoản của tôi", link: "../profile/index.html" },
		],
	},
	// Trang Chi tiết sản phẩm (Ví dụ)
	"/product-detail/index.html": {
		title: "Chi tiết sản phẩm",
		parents: [
			{ name: "Trang chủ", link: "../index.html" },
			{ name: "Sản phẩm", link: "../index.html" }, // Hoặc link về danh sách SP
		],
	},
	// Trang Profile chính
	"/profile/index.html": {
		title: "Tài khoản của tôi",
		parents: [{ name: "Trang chủ", link: "../index.html" }],
	},
	// Trang nhắn tin
	"/chat/index.html": {
		title: "Liên Lạc",
		parents: [{ name: "Trang chủ", link: "../index.html" }],
	},
	"/auction/index.html": {
		title: "Trang đấu giá",
		parents: [{ name: "Trang chủ", link: "../index.html" }],
	},
	"/write-review/index.html": {
		title: "Đánh giá sản phẩm",
		parents: [{ name: "Danh sách mua", link: "../buy-list/index.html" }],
	},
	"/watchlist/index.html": {
		title: "Theo dõi sản phẩm",
		parents: [{ name: "Trang chủ", link: "../index.html" }],
	},
	"/notifications/index.html": {
		title: "Thông báo",
		parents: [{ name: "Trang chủ", link: "../index.html" }],
	},
};

// Hàm render
function renderBreadcrumb() {
	const container = document.getElementById("breadcrumb-container");
	if (!container) return;

	// 1. Lấy đường dẫn hiện tại (ví dụ: /membership/index.html)
	const currentPath = window.location.pathname;

	// Tìm cấu hình khớp với đường dẫn hiện tại
	// (Dùng .endsWith để khớp đuôi vì path có thể khác nhau tùy môi trường deploy)
	const pageKey = Object.keys(sitemap).find((key) => currentPath.endsWith(key));
	const pageConfig = sitemap[pageKey];

	if (!pageConfig) return; // Không có cấu hình thì không hiện

	// 2. Tạo HTML
	let html = `
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
    `;

	// Render các mục cha (Parents)
	pageConfig.parents.forEach((parent) => {
		html += `
            <li class="breadcrumb-item">
                <a href="${parent.link}" class="text-decoration-none" style="color: #00897B;">${parent.name}</a>
            </li>
        `;
	});

	// Render mục hiện tại (Active)
	html += `
                <li class="breadcrumb-item active" aria-current="page">
                    ${pageConfig.title}
                </li>
            </ol>
        </nav>
    `;

	// 3. Chèn vào trang
	container.innerHTML = html;
}

// Tự động chạy khi load file
renderBreadcrumb();
