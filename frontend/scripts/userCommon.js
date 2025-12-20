import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

document.addEventListener("DOMContentLoaded", async () => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const authSection = document.getElementById("auth-section");
	if (Object.keys(user).length > 0) {
		// document.getElementById("user-avatar").src =
		// 	R2_PUBLIC_URL + (user.avatar || "");
		authSection.innerHTML = `
		<img
		src="${R2_PUBLIC_URL + (user.avatar || "")}"
		class="rounded-circle user-avatar"
		width="35"
		height="35"
		alt="Avatar"
		id="user-avatar"
		onclick="window.location.href='./profile/index.html'"
	/>`;
	} else {
		authSection.innerHTML = `<a href="../auth/index.html" class="btn-login">Đăng Nhập</a>`;
	}
});
