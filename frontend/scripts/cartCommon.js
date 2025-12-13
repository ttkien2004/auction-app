import cartApi from "../services/cartApi.js";

document.addEventListener("DOMContentLoaded", async () => {
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
