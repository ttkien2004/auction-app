import cartApi from "../services/cartApi.js";

document.addEventListener("DOMContentLoaded", async () => {
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	if (Object.keys(user).length === 0) {
		return;
	}
	const cartList = document.getElementById("count-cart-list");
	if (cartList !== null) {
		try {
			const cartData = await cartApi.getCart();
			cartList.innerHTML = cartData.length;
		} catch (err) {
			console.error(err);
		}
	}
});
