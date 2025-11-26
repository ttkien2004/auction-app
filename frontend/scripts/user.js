// TODO: Dùng file này cho việc gọi đến các Api services
import { R2_PUBLIC_URL } from "../services/apiHelpers.js";
import userApi from "../services/userApi.js";

document.addEventListener("DOMContentLoaded", async () => {
	const emailInput = document.getElementById("email-input").value;
	const usernameInput = document.getElementById("username-input").value;
	const passwordInput = document.getElementById("password-input").value;
	const phoneInput = document.getElementById("phone-input").value;
	const profileForm = document.getElementById("user-profile-form");
	if (profileForm) {
		profileForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const updateData = {
				name: usernameInput,
				email: emailInput,
				password: passwordInput,
				phone_number: phoneInput,
			};
			try {
				const updatedUser = await userApi.updateUser(updateData);
				alert("Updated user profile successfully!");
				emailInput.value = updatedUser.email;
				usernameInput.value = updatedUser.username;
				phoneInput.value = updatedUser.phone_number;
			} catch (error) {
				console.error("Lỗi khi cập nhật thông tin người dùng:", error);
			}
		});
	}
});

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const user = await userApi.getUserProfile();
		localStorage.setItem("userProfile", JSON.stringify(user));
		const userProfile = user.profile;
		// console.log("User profile:", profile);
		document.getElementById("username-input").value =
			userProfile.username || "";
		document.getElementById("email-input").value = userProfile.email || "";
		document.getElementById("phone-input").value =
			userProfile.phone_number || "";
		document.getElementById("user-avatar").src =
			R2_PUBLIC_URL + (userProfile.avatar || "");
	} catch (error) {
		console.error("Lỗi khi lấy thông tin người dùng:", error);
	}
});
