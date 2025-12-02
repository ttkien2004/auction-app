import cartApi from "../services/cartApi.js";

const cartList = document.getElementById("count-cart-list");
document.addEventListener("DOMContentLoaded", async () => {
	try {
		const cartData = await cartApi.getCart();
		cartList.innerHTML = cartData.length;
	} catch (err) {
		console.error(err);
	}
});
