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
