import { R2_PUBLIC_URL } from "../services/apiHelpers.js";
import reviewApi from "../services/reviewApi.js";
import transactionApi from "../services/transactionApi.js";

const urlParams = new URLSearchParams(window.location.search);
const transactionId = urlParams.get("transactionId");

// 1. XỬ LÝ SAO LỚN (CHẤT LƯỢNG SẢN PHẨM)
const stars = document.querySelectorAll(".star-rating .star");
const ratingText = document.getElementById("rating-text");
const textMap = {
	1: "Tệ",
	2: "Không hài lòng",
	3: "Bình thường",
	4: "Hài lòng",
	5: "Tuyệt vời",
};

let currentRating = 5; // Mặc định
let selectedRating = 5;

document.addEventListener("DOMContentLoaded", async () => {
	if (!transactionId) {
		alert("Không tìm thấy đơn hàng cần đánh giá");
		return;
	}
	const trans = await transactionApi.getTransactionById(transactionId);
	renderProductInfo(trans);
	setupStarRating();
});

function setupStarRating() {
	const stars = document.querySelectorAll(".star-rating .star");
	const textEl = document.getElementById("rating-text");
	const texts = [
		"Tệ",
		"Không hài lòng",
		"Bình thường",
		"Hài lòng",
		"Tuyệt vời",
	];

	stars.forEach((star, index) => {
		star.addEventListener("click", () => {
			selectedRating = index + 1;
			// Update UI
			stars.forEach((s, i) => {
				if (i < selectedRating) s.classList.add("active");
				else s.classList.remove("active");
			});
			textEl.innerText = texts[index];
		});
	});
}

// Xử lý nút Gửi
const btnSubmit = document.getElementById("btn-submit");
if (btnSubmit) {
	btnSubmit.addEventListener("click", async () => {
		const comment = document.querySelector(".custom-textarea").value;

		try {
			btnSubmit.disabled = true;
			btnSubmit.innerText = "Đang gửi...";

			await reviewApi.createReview({
				transactionId: parseInt(transactionId),
				rating: selectedRating,
				comment: comment,
			});

			alert("Cảm ơn bạn đã đánh giá!");
			window.location.href = "../buy-list/index.html"; // Quay về danh sách mua
		} catch (error) {
			console.error(error);
			alert("Lỗi: " + error.message);
			btnSubmit.disabled = false;
			btnSubmit.innerText = "Gửi Đánh Giá";
		}
	});
}

function renderProductInfo(trans) {
	const productNameHtml = document.getElementById("product-name");
	const productImgHtml = document.getElementById("product-img");

	const productName = trans.Product?.name || "ÁO Tliet";
	const productImg =
		R2_PUBLIC_URL + trans.Product?.image || "https://placehold.co/80";
	productNameHtml.innerHTML = productName;
	productImgHtml.src = productImg;
}

// Set trạng thái ban đầu
highlightStars(5);

stars.forEach((star, index) => {
	// Hover vào
	star.addEventListener("mouseover", () => {
		highlightStars(index + 1);
		ratingText.innerText = textMap[index + 1];
	});

	// Click chọn
	star.addEventListener("click", () => {
		currentRating = index + 1;
	});

	// Chuột rời ra -> Reset về cái đã chọn
	star.parentElement.addEventListener("mouseleave", () => {
		highlightStars(currentRating);
		ratingText.innerText = textMap[currentRating];
	});
});

function highlightStars(count) {
	stars.forEach((s, i) => {
		if (i < count) s.classList.add("active");
		else s.classList.remove("active");
	});
}

// 2. XỬ LÝ TAG NHANH
window.toggleTag = (el) => {
	el.classList.toggle("active");
	// Logic: Cộng chuỗi tag vào textarea nếu muốn
};

// 3. XỬ LÝ SAO NHỎ (SERVICE)
document.querySelectorAll(".small-stars").forEach((group) => {
	const smallStars = group.querySelectorAll("i");

	smallStars.forEach((s, idx) => {
		s.addEventListener("click", () => {
			// Reset hết về rỗng (far)
			smallStars.forEach((item) => {
				item.className = "far fa-star";
				item.classList.remove("active");
			});
			// Fill màu vàng (fas) cho các sao đã chọn
			for (let i = 0; i <= idx; i++) {
				smallStars[i].className = "fas fa-star active";
			}
		});
	});
});

// 4. XỬ LÝ UPLOAD PREVIEW
window.handleFiles = (input) => {
	const container = document.getElementById("preview-list");
	if (input.files) {
		Array.from(input.files).forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = document.createElement("img");
				img.src = e.target.result;
				img.className = "preview-item";
				container.appendChild(img);
			};
			reader.readAsDataURL(file);
		});
	}
};
