import { R2_PUBLIC_URL } from "../services/apiHelpers.js";

document.addEventListener("DOMContentLoaded", async () => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	document.getElementById("user-avatar").src =
		R2_PUBLIC_URL + (user.avatar || "");
});
