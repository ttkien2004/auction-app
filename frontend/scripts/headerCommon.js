document.addEventListener("DOMContentLoaded", () => {
	const navbar = document.querySelector(".navbar");
	const user = JSON.parse(localStorage.getItem("user" || "{}"));
	if (Object.keys(user).length === 0) {
		window.location.href = "index.html";
		return;
	}
	if (user.Buyer) {
		navbar.innerHTML = `
			<div
				class="container-fluid d-flex align-items-center justify-content-between"
			>
				<a class="navbar-brand" href="../index.html"><img src="https://pub-5b7cac1b9b48469b8649bd95b8f0bfd1.r2.dev/GreenLife_Logo.png" style="width: 50px; height: 50px" /> CŨ MÀ CHẤT</a>
				<div class="nav-search">
					<i class="fas fa-search"></i>
					<input type="text" placeholder="Tìm kiếm" />
				</div>
				<div class="nav-menu d-flex align-items-center">
					<a href="../index.html">Trang Chủ</a>
					<a href="#">Sản Phẩm</a>
					<a href="../chat/index.html">Liên Lạc</a>
					<a href="./notifications/index.html" class="position-relative me-3">
							<i class="fas fa-bell fa-lg text-teal"></i>
							<span
								id="count-notification"
								class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
							>
								0
								<span class="visually-hidden">unread messages</span>
							</span>
						</a>
					<a href="../cart-list/index.html" class="position-relative me-3">
						<i class="fas fa-shopping-cart fa-lg text-teal"></i>
						<span
							id="count-cart-list"
							class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
						>
							2
						</span>
					</a>
					<div
						id="auth-section"
						onclick="window.location.href='../profile/index.html'"
					>
						<img id="user-avatar" alt="User" />
					</div>
				</div>
			</div>
        `;
	} else {
		navbar.innerHTML = `
			<div
				class="container-fluid d-flex align-items-center justify-content-between"
			>
				<a class="navbar-brand" href="#"><img src="https://pub-5b7cac1b9b48469b8649bd95b8f0bfd1.r2.dev/GreenLife_Logo.png" style="width: 50px; height: 50px" /> CŨ MÀ CHẤT</a>
				<div class="nav-search">
					<i class="fas fa-search"></i>
					<input type="text" placeholder="Tìm kiếm" />
				</div>
				<div class="nav-menu">
					<a href="../seller-dashboard/index.html">Quản lý Sản Phẩm</a>
					<a href="#">Liên Lạc</a>
					<div
						id="auth-section"
						onclick="window.location.href='../profile/index.html'"
					>
						<img
							src="https://i.pravatar.cc/150?img=5"
							id="user-avatar"
							alt="User"
						/>
					</div>
				</div>
			</div>
        `;
	}
});
