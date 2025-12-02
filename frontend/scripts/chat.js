// // js/chat-real.js
// import authApi from "../services/authApi.js"; // Import service đăng nhập
// import chatApi from "../services/chatApi.js";
// import { BASE_URL } from "../services/apiHelpers.js";
// const socket = io("http://localhost:3000");

// // Biến lưu thông tin user hiện tại
// let currentUser = null;
// let currentConversationId = null;

// // Lấy productId từ URL (nếu có)
// const urlParams = new URLSearchParams(window.location.search);
// const currentProductId = urlParams.get("productId");

// // DOM Elements
// const loginSection = document.getElementById("login-section");
// const chatSection = document.getElementById("chat-section");
// const loginError = document.getElementById("login-error");
// const messagesArea = document.getElementById("messages-area");
// const msgInput = document.getElementById("message-input");
// const btnSend = document.getElementById("btn-send");

// // --- 1. XỬ LÝ ĐĂNG NHẬP ---
// // Tự động login nếu đã có token lưu trong localStorage
// document.addEventListener("DOMContentLoaded", async () => {
// 	const storedUser = localStorage.getItem("user");
// 	const storedToken = localStorage.getItem("token");

// 	// 1. Kiểm tra đăng nhập
// 	if (storedUser && storedToken) {
// 		currentUser = JSON.parse(storedUser);
// 		showChatUI(); // Hiển thị giao diện, ẩn form login

// 		// 2. NẾU CÓ PRODUCT ID TRÊN URL -> TỰ ĐỘNG LOAD LỊCH SỬ
// 		if (currentProductId) {
// 			console.log("Đang tải lịch sử chat cho sản phẩm:", currentProductId);
// 			await loadChatHistory(currentProductId);
// 		}
// 	} else {
// 		loginSection.classList.remove("d-none");
// 	}
// });

// document.getElementById("btn-login").addEventListener("click", async () => {
// 	const email = document.getElementById("email").value;
// 	const password = document.getElementById("password").value;

// 	try {
// 		// Gọi API đăng nhập thật
// 		const response = await authApi.login({ email, password });

// 		// Nếu thành công
// 		if (response && response.token) {
// 			// Lưu token và thông tin user
// 			console.log("Đăng nhập thành công:", response);
// 			localStorage.setItem("token", response.token);
// 			localStorage.setItem("user", JSON.stringify(response.user));
// 			currentUser = response.user;

// 			// Chuyển giao diện
// 			showChatUI();
// 		} else {
// 			loginError.innerText = "Đăng nhập thất bại (Không có token)";
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		loginError.innerText = error.message || "Sai email hoặc mật khẩu";
// 	}
// });
// // Load lịch sử chat
// async function loadChatHistory(productId) {
// 	try {
// 		// Gọi API Backend (Bạn cần thêm hàm này vào apiHelpers hoặc gọi fetch trực tiếp)
// 		const conversation = await chatApi.getConversationByProductId(productId);

// 		// A. TRƯỜNG HỢP ĐÃ CÓ LỊCH SỬ CHAT
// 		if (conversation) {
// 			// 1. Cập nhật ID hội thoại hiện tại
// 			currentConversationId = conversation.ID;

// 			// 2. Vẽ lại tin nhắn cũ lên màn hình
// 			conversation.Message.forEach((msg) => {
// 				const isMine = msg.sender_ID === currentUser.id;
// 				appendMessage(msg.content, isMine, msg.Sender?.name);
// 			});

// 			// 3. Tự động Join Socket ngay lập tức
// 			socket.emit("join_chat", currentConversationId);
// 			// Cập nhật UI
// 			document.getElementById(
// 				"room-status"
// 			).innerText = `Đã vào phòng ${currentConversationId}`;
// 			document.getElementById("room-status").className = "text-success fw-bold";
// 			msgInput.disabled = false;
// 			btnSend.disabled = false;
// 		}
// 		// B. TRƯỜNG HỢP CHƯA TỪNG CHAT (CHAT MỚI)
// 		else {
// 			console.log("Chưa có lịch sử. Bắt đầu cuộc trò chuyện mới.");
// 			messagesArea.innerHTML =
// 				'<div class="text-center text-muted small my-3">-- Bắt đầu cuộc trò chuyện với người bán --</div>';
// 		}
// 	} catch (error) {
// 		console.error("Lỗi load history:", error);
// 	}
// }

// function showChatUI() {
// 	loginSection.classList.add("d-none");
// 	chatSection.classList.remove("d-none");

// 	document.getElementById("user-name").innerText =
// 		currentUser.name || currentUser.email;
// 	document.getElementById("user-id").innerText = currentUser.id; // ID thật từ DB
// }

// // --- 3. XỬ LÝ GỬI TIN NHẮN ---
// btnSend.addEventListener("click", sendMessage);
// msgInput.addEventListener("keypress", (e) => {
// 	if (e.key === "Enter") sendMessage();
// });

// function sendMessage() {
// 	const content = msgInput.value.trim();
// 	if (!content) return;

// 	// Dữ liệu gửi đi (Dùng ID thật của user đang đăng nhập)
// 	const messageData = {
// 		conversationId: currentConversationId || null,
// 		senderId: currentUser.id, // <-- QUAN TRỌNG: Dùng ID thật
// 		content: content,
// 		isBotChat: false,
// 		productId: currentProductId ? parseInt(currentProductId) : null, // Giả sử chat về sản phẩm ID 9
// 	};

// 	// Bắn socket
// 	socket.emit("send_message", messageData);

// 	// Hiện tin nhắn của mình lên (Optimistic UI)
// 	appendMessage(content, true);
// 	msgInput.value = "";
// }

// // --- 4. LẮNG NGHE TIN NHẮN ĐẾN ---
// socket.on("receive_message", (data) => {
// 	console.log("Nhận tin:", data);

// 	if (!currentConversationId && data.conversationId) {
// 		currentConversationId = data.conversation_ID;
// 	}

// 	// Kiểm tra xem tin nhắn có phải của mình không
// 	// (Lưu ý: data.sender_ID là từ server trả về, currentUser.ID là local)
// 	const isMine =
// 		data.sender_ID === currentUser.id || data.senderId === currentUser.id;

// 	// Nếu là của mình thì không hiện lại (vì đã hiện lúc gửi rồi), hoặc hiện lại để confirm
// 	if (!isMine) {
// 		appendMessage(data.content, false, data.Sender?.name);
// 	}
// });

// // Helper vẽ tin nhắn
// function appendMessage(text, isMine, senderName) {
// 	const div = document.createElement("div");
// 	div.className = `message ${isMine ? "my-msg" : "other-msg"}`;

// 	let html = "";
// 	if (!isMine && senderName) {
// 		html += `<small class="d-block text-muted" style="font-size:0.7rem">${senderName}</small>`;
// 	}
// 	html += text;

// 	div.innerHTML = html;
// 	messagesArea.appendChild(div);
// 	messagesArea.scrollTop = messagesArea.scrollHeight;
// }

// // --- 5. ĐĂNG XUẤT ---
// // document.getElementById("btn-logout").addEventListener("click", () => {
// // 	localStorage.clear();
// // 	location.reload();
// // });

// js/chat.js
import authApi from "../services/authApi.js";
import chatApi from "../services/chatApi.js";
import { BASE_URL, R2_PUBLIC_URL } from "../services/apiHelpers.js"; // Import R2_PUBLIC_URL

const socket = io("http://localhost:3000");

// Biến lưu trữ trạng thái
let currentUser = null;
let currentConversationId = null;

// Lấy productId từ URL (nếu có)
const urlParams = new URLSearchParams(window.location.search);
const currentProductId = urlParams.get("productId");
const conversationIdParam = urlParams.get("conversationId");

// --- 1. KHAI BÁO DOM ELEMENTS (KHỚP VỚI HTML MỚI) ---
const els = {
	// Login Form
	loginSection: document.getElementById("login-section"),
	emailInput: document.getElementById("email"),
	passwordInput: document.getElementById("password"),
	btnLogin: document.getElementById("btn-login"),
	loginError: document.getElementById("login-error"),

	// Chat UI
	chatSection: document.getElementById("chat-section"),
	chatPartnerName: document.getElementById("chat-partner-name"), // Tên người đang chat cùng
	roomStatus: document.getElementById("room-status"),

	// Message Area
	messagesArea: document.getElementById("messages-area"),
	msgInput: document.getElementById("message-input"),
	btnSend: document.getElementById("btn-send"),

	// Navbar
	authSection: document.getElementById("auth-section"),
	conversationList: document.querySelector(".conversation-list"), // Element chứa danh sách bên trái
	chatContent: document.querySelector(".chat-content"),
};

// --- 2. KHỞI TẠO (LOAD TRANG) ---
document.addEventListener("DOMContentLoaded", async () => {
	const storedUser = localStorage.getItem("user");
	const storedToken = localStorage.getItem("token");

	if (storedUser && storedToken) {
		currentUser = JSON.parse(storedUser);

		// Render Avatar lên Navbar
		// renderHeaderUser(currentUser);

		// Hiển thị giao diện Chat
		showChatUI();

		// Hiện thị danh sách chat bên trái
		await loadSidebar();

		if (currentProductId) {
			// Trường hợp 1: Bấm từ nút "Liên hệ" -> Tìm theo Product
			await loadChatByProduct(currentProductId);
		} else if (conversationIdParam) {
			// Trường hợp 2: Bấm từ thông báo/link trực tiếp -> Tìm theo ID hội thoại
			await loadConversation(conversationIdParam);
		}
	} else {
		// Hiện form login
		if (els.loginSection) els.loginSection.style.display = "block";
	}
});

// --- 3. XỬ LÝ ĐĂNG NHẬP ---
if (els.btnLogin) {
	els.btnLogin.addEventListener("click", async () => {
		const email = els.emailInput.value;
		const password = els.passwordInput.value;

		try {
			els.btnLogin.innerText = "Đang xử lý...";
			const response = await authApi.login({ email, password });

			if (response && response.token) {
				localStorage.setItem("token", response.token);
				localStorage.setItem("user", JSON.stringify(response.user));
				currentUser = response.user;

				renderHeaderUser(currentUser);
				showChatUI();
			} else {
				els.loginError.innerText = "Đăng nhập thất bại";
			}
		} catch (error) {
			console.error(error);
			els.loginError.innerText = error.message || "Lỗi đăng nhập";
		} finally {
			els.btnLogin.innerText = "ĐĂNG NHẬP";
		}
	});
}

// --- 4. HÀM LOAD LỊCH SỬ & XÁC ĐỊNH ĐỐI PHƯƠNG ---
async function loadChatByProduct(productId) {
	try {
		// Gọi API lấy hội thoại theo sản phẩm
		// (Bạn cần đảm bảo chatApi.getConversationByProductId đã được hiện thực)
		const conversation = await chatApi.getConversationByProductId(productId);

		if (conversation) {
			// Cập nhật ID
			currentConversationId = conversation.ID;

			// --- LOGIC XÁC ĐỊNH TÊN NGƯỜI KIA ---
			// Nếu mình là Buyer -> Tên kia là Seller
			// Nếu mình là Seller -> Tên kia là Buyer
			let partnerName = "Người lạ";
			if (currentUser.id === conversation.buyer_ID) {
				partnerName = conversation.Seller?.User?.name || "Người bán";
			} else {
				partnerName = conversation.Buyer?.User?.name || "Người mua";
			}

			// Cập nhật Header Chat
			if (els.chatPartnerName) els.chatPartnerName.innerText = partnerName;
			if (els.roomStatus) els.roomStatus.innerText = "Online";

			// Render tin nhắn cũ
			if (conversation.Message) {
				els.messagesArea.innerHTML = ""; // Xóa text mặc định
				conversation.Message.forEach((msg) => {
					const isMine = msg.sender_ID === currentUser.id;
					appendMessage(msg.content, isMine);
				});
			}

			// Scroll xuống cuối
			scrollToBottom();

			// Join Socket
			socket.emit("join_chat", currentConversationId);
			enableChatInput();
		} else {
			// Chat mới
			if (els.chatPartnerName)
				els.chatPartnerName.innerText = "Người bán (Chat mới)";
			if (els.roomStatus) els.roomStatus.innerText = "Sẵn sàng";
			enableChatInput();
		}
	} catch (error) {
		console.error("Lỗi load history:", error);
	}
}

// --- 5. GỬI TIN NHẮN ---
if (els.btnSend) {
	els.btnSend.addEventListener("click", sendMessage);
}
if (els.msgInput) {
	els.msgInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") sendMessage();
	});
}

function sendMessage() {
	const content = els.msgInput.value.trim();
	if (!content) return;

	const messageData = {
		conversationId: currentConversationId || null,
		senderId: currentUser.id,
		content: content,
		isBotChat: false,
		productId: currentProductId ? parseInt(currentProductId) : null,
	};

	// Gửi Socket
	socket.emit("send_message", messageData);

	// Hiện tin nhắn ngay (Optimistic UI)
	appendMessage(content, true);
	els.msgInput.value = "";
	scrollToBottom();
}

// --- 6. NHẬN TIN NHẮN (SOCKET) ---
socket.on("receive_message", (data) => {
	// Cập nhật ID nếu là chat mới tạo
	if (!currentConversationId && data.conversation_ID) {
		currentConversationId = data.conversation_ID;
	}

	const isMine =
		data.sender_ID === currentUser.id || data.senderId === currentUser.id;
	if (!isMine) {
		appendMessage(data.content, false);
		scrollToBottom();
	}
});

// --- HÀM BỔ TRỢ ---

function showChatUI() {
	if (els.loginSection) els.loginSection.style.display = "none"; // Ẩn Login
	// Hiện Chat Wrapper (Lớp cha container)
	if (els.chatSection) {
		els.chatSection.classList.remove("d-none");
		els.chatSection.style.display = "flex"; // Đảm bảo flex để chia cột
	}
}

function renderHeaderUser(user) {
	if (!els.authSection) return;

	const avatarUrl = user.avatar
		? `${R2_PUBLIC_URL}/${user.avatar}` // Ghép URL ảnh
		: "../assets/images/avatar_default.png";

	els.authSection.innerHTML = `
        <a href="../html/profile.html" title="${user.name}">
            <img src="${avatarUrl}" class="user-avatar" style="width:35px;height:35px;border-radius:50%;border:2px solid #00897B">
        </a>
    `;
}

function appendMessage(text, isMine) {
	const div = document.createElement("div");
	// Sử dụng đúng class trong CSS mới: 'my-msg' hoặc 'other-msg'
	div.className = `message ${isMine ? "my-msg" : "other-msg"}`;
	div.innerText = text;
	els.messagesArea.appendChild(div);
}

function scrollToBottom() {
	if (els.messagesArea)
		els.messagesArea.scrollTop = els.messagesArea.scrollHeight;
}

function enableChatInput() {
	if (els.msgInput) els.msgInput.disabled = false;
	if (els.btnSend) els.btnSend.disabled = false;
}
async function loadSidebar() {
	try {
		// Gọi API GET /conversations (bạn cần thêm vào chatApi.js)
		// const conversations = await chatApi.getMyConversations();
		// Tạm thời giả lập fetch tại đây:
		const token = localStorage.getItem("token");
		const conversations = await chatApi.getConversations();
		console.log(conversations);

		els.conversationList.innerHTML = ""; // Clear cũ

		conversations.forEach((conv) => {
			// Xác định đối phương
			let partner = currentUser.id === conv.buyer_ID ? conv.Seller : conv.Buyer;
			const lastMsg = conv.Message[0]?.content || "Bắt đầu cuộc trò chuyện";
			const time = new Date(conv.updated_at).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
			const avatar = partner.User?.avatar
				? `${R2_PUBLIC_URL}/${partner.User.avatar}`
				: "https://placehold.co/50";

			// HTML cho 1 dòng hội thoại
			const item = document.createElement("div");
			item.className = `conv-item ${
				conv.ID == currentConversationId ? "active" : ""
			}`;
			item.dataset.id = conv.ID; // Lưu ID để click
			item.innerHTML = `
                <img src="${avatar}" class="avatar">
                <div class="conv-info">
                    <div class="conv-name">${
											partner.User?.name || partner.name
										}</div>
                    <div class="conv-preview text-muted small">${
											conv.Product?.name ? "[" + conv.Product.name + "] " : ""
										}${lastMsg}</div>
                </div>
                <div class="conv-time">${time}</div>
            `;

			// Sự kiện Click vào Sidebar
			item.addEventListener("click", () => {
				// Đổi UI active
				document
					.querySelectorAll(".conv-item")
					.forEach((i) => i.classList.remove("active"));
				item.classList.add("active");

				// Load nội dung chat
				loadConversation(conv.ID);
			});

			els.conversationList.appendChild(item);
		});
	} catch (error) {
		console.error("Lỗi load sidebar:", error);
	}
}

async function loadConversation(conversationId) {
	try {
		// 1. Cập nhật ID hiện tại
		currentConversationId = conversationId;

		// 2. Gọi API lấy chi tiết hội thoại
		const conversation = await chatApi.getConversationById(conversationId);

		if (!conversation) return;

		// 3. Xác định đối phương (Partner)
		let partnerName = "Người dùng";
		let partnerId = null;

		if (currentUser.id === conversation.buyer_ID) {
			// Mình là người mua -> Lấy thông tin Seller
			partnerName = conversation.Seller?.User?.name || "Người bán";
			partnerId = conversation.seller_ID;

			// (Lưu ý: Nếu bạn cần buyerId, thì nó chính là currentUser.id ở trường hợp này)
		} else {
			// Mình là người bán -> Lấy thông tin Buyer
			partnerName = conversation.Buyer?.User?.name || "Người mua";
			partnerId = conversation.buyer_ID;
		}

		// 4. Cập nhật Header Chat
		if (els.chatPartnerName) els.chatPartnerName.innerText = partnerName;
		if (els.roomStatus) els.roomStatus.innerText = "Đang trực tuyến";

		// 5. Render Tin nhắn cũ
		els.messagesArea.innerHTML = ""; // Xóa tin nhắn của hội thoại cũ
		if (conversation.Message && conversation.Message.length > 0) {
			conversation.Message.forEach((msg) => {
				const isMine = msg.sender_ID === currentUser.id;
				appendMessage(msg.content, isMine);
			});
		} else {
			els.messagesArea.innerHTML =
				'<div class="text-center text-muted small my-3">-- Bắt đầu cuộc trò chuyện --</div>';
		}

		// 6. Xử lý Socket
		socket.emit("join_chat", currentConversationId); // Join phòng mới
		enableChatInput();
		scrollToBottom();
	} catch (error) {
		console.error("Lỗi load conversation:", error);
	}
}
