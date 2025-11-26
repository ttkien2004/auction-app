import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

document.addEventListener("DOMContentLoaded", async () => {
	const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
	const userProfile = user.profile;
	document.getElementById("user-avatar").src =
		R2_PUBLIC_URL + (userProfile.avatar || "");
});
