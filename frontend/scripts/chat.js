// js/chat-real.js
import authApi from "../services/authApi.js"; // Import service đăng nhập
import chatApi from "../services/chatApi.js";
import { BASE_URL } from "../services/apiHelpers.js";
const socket = io("http://localhost:3000");

// Biến lưu thông tin user hiện tại
let currentUser = null;
let currentConversationId = null;

// Lấy productId từ URL (nếu có)
const urlParams = new URLSearchParams(window.location.search);
const currentProductId = urlParams.get("productId");

// DOM Elements
const loginSection = document.getElementById("login-section");
const chatSection = document.getElementById("chat-section");
const loginError = document.getElementById("login-error");
const messagesArea = document.getElementById("messages-area");
const msgInput = document.getElementById("message-input");
const btnSend = document.getElementById("btn-send");

// --- 1. XỬ LÝ ĐĂNG NHẬP ---
// Tự động login nếu đã có token lưu trong localStorage
document.addEventListener("DOMContentLoaded", async () => {
	const storedUser = localStorage.getItem("user");
	const storedToken = localStorage.getItem("token");

	// 1. Kiểm tra đăng nhập
	if (storedUser && storedToken) {
		currentUser = JSON.parse(storedUser);
		showChatUI(); // Hiển thị giao diện, ẩn form login

		// 2. NẾU CÓ PRODUCT ID TRÊN URL -> TỰ ĐỘNG LOAD LỊCH SỬ
		if (currentProductId) {
			console.log("Đang tải lịch sử chat cho sản phẩm:", currentProductId);
			await loadChatHistory(currentProductId);
		}
	} else {
		loginSection.classList.remove("d-none");
	}
});

document.getElementById("btn-login").addEventListener("click", async () => {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	try {
		// Gọi API đăng nhập thật
		const response = await authApi.login({ email, password });

		// Nếu thành công
		if (response && response.token) {
			// Lưu token và thông tin user
			console.log("Đăng nhập thành công:", response);
			localStorage.setItem("token", response.token);
			localStorage.setItem("user", JSON.stringify(response.user));
			currentUser = response.user;

			// Chuyển giao diện
			showChatUI();
		} else {
			loginError.innerText = "Đăng nhập thất bại (Không có token)";
		}
	} catch (error) {
		console.error(error);
		loginError.innerText = error.message || "Sai email hoặc mật khẩu";
	}
});
// Load lịch sử chat
async function loadChatHistory(productId) {
	try {
		// Gọi API Backend (Bạn cần thêm hàm này vào apiHelpers hoặc gọi fetch trực tiếp)
		const conversation = await chatApi.getConversationByProductId(productId);

		// A. TRƯỜNG HỢP ĐÃ CÓ LỊCH SỬ CHAT
		if (conversation) {
			// 1. Cập nhật ID hội thoại hiện tại
			currentConversationId = conversation.ID;

			// 2. Vẽ lại tin nhắn cũ lên màn hình
			conversation.Message.forEach((msg) => {
				const isMine = msg.sender_ID === currentUser.id;
				appendMessage(msg.content, isMine, msg.Sender?.name);
			});

			// 3. Tự động Join Socket ngay lập tức
			socket.emit("join_chat", currentConversationId);
			// Cập nhật UI
			document.getElementById(
				"room-status"
			).innerText = `Đã vào phòng ${currentConversationId}`;
			document.getElementById("room-status").className = "text-success fw-bold";
			msgInput.disabled = false;
			btnSend.disabled = false;
		}
		// B. TRƯỜNG HỢP CHƯA TỪNG CHAT (CHAT MỚI)
		else {
			console.log("Chưa có lịch sử. Bắt đầu cuộc trò chuyện mới.");
			messagesArea.innerHTML =
				'<div class="text-center text-muted small my-3">-- Bắt đầu cuộc trò chuyện với người bán --</div>';
		}
	} catch (error) {
		console.error("Lỗi load history:", error);
	}
}

function showChatUI() {
	loginSection.classList.add("d-none");
	chatSection.classList.remove("d-none");

	document.getElementById("user-name").innerText =
		currentUser.name || currentUser.email;
	document.getElementById("user-id").innerText = currentUser.id; // ID thật từ DB
}

// --- 2. XỬ LÝ SOCKET (JOIN ROOM) ---
document.getElementById("btn-join-room").addEventListener("click", () => {
	const roomId = document.getElementById("conversation-id").value;
	if (!roomId) return;

	currentConversationId = parseInt(roomId);

	// Gửi sự kiện join phòng
	socket.emit("join_chat", currentConversationId);

	// Cập nhật UI
	document.getElementById(
		"room-status"
	).innerText = `Đã vào phòng ${currentConversationId}`;
	document.getElementById("room-status").className = "text-success fw-bold";
	msgInput.disabled = false;
	btnSend.disabled = false;
	messagesArea.innerHTML =
		'<div class="text-center text-muted small my-2">-- Đã vào phòng --</div>';
});

// --- 3. XỬ LÝ GỬI TIN NHẮN ---
btnSend.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") sendMessage();
});

function sendMessage() {
	const content = msgInput.value.trim();
	if (!content) return;

	// Dữ liệu gửi đi (Dùng ID thật của user đang đăng nhập)
	const messageData = {
		conversationId: currentConversationId || null,
		senderId: currentUser.id, // <-- QUAN TRỌNG: Dùng ID thật
		content: content,
		isBotChat: false,
		productId: currentProductId ? parseInt(currentProductId) : null, // Giả sử chat về sản phẩm ID 9
	};

	// Bắn socket
	socket.emit("send_message", messageData);

	// Hiện tin nhắn của mình lên (Optimistic UI)
	appendMessage(content, true);
	msgInput.value = "";
}

// --- 4. LẮNG NGHE TIN NHẮN ĐẾN ---
socket.on("receive_message", (data) => {
	console.log("Nhận tin:", data);

	if (!currentConversationId && data.conversationId) {
		currentConversationId = data.conversation_ID;
	}

	// Kiểm tra xem tin nhắn có phải của mình không
	// (Lưu ý: data.sender_ID là từ server trả về, currentUser.ID là local)
	const isMine =
		data.sender_ID === currentUser.id || data.senderId === currentUser.id;

	// Nếu là của mình thì không hiện lại (vì đã hiện lúc gửi rồi), hoặc hiện lại để confirm
	if (!isMine) {
		appendMessage(data.content, false, data.Sender?.name);
	}
});

// Helper vẽ tin nhắn
function appendMessage(text, isMine, senderName) {
	const div = document.createElement("div");
	div.className = `message ${isMine ? "my-msg" : "other-msg"}`;

	let html = "";
	if (!isMine && senderName) {
		html += `<small class="d-block text-muted" style="font-size:0.7rem">${senderName}</small>`;
	}
	html += text;

	div.innerHTML = html;
	messagesArea.appendChild(div);
	messagesArea.scrollTop = messagesArea.scrollHeight;
}

// --- 5. ĐĂNG XUẤT ---
document.getElementById("btn-logout").addEventListener("click", () => {
	localStorage.clear();
	location.reload();
});
