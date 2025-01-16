document.getElementById("saveEmail").addEventListener("click", async function () {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    notify({ type: "error", msg: "Please enter an email address."});
    return;
  }

  // Gửi email để lấy mã OTP
  const response = await fetch("http://localhost:5000/api/customer/update-profile/email/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    document.getElementById("otpSection").style.display = "block";
  } else {
    notify({ type: "error", msg: "Failed to send verification email."});
  }
});

async function getCustomerID() {
    try {
        const response = await fetch('http://localhost:5000/api/customer/id');
        if (!response.ok) {
            throw new Error(`Error fetching customer ID: ${response.status}`);
        }
        if (response.status == "error") {
            notify({ type: "error", msg: "Please login first to write a review!"});
            return null;
        }
      const data = await response.json();
        return data.data._id; // Trả về dữ liệu customer ID từ API
    }
    catch (error) {
        console.error("Error fetching customer ID:", error);
        return null; // Trả về null nếu có lỗi
    }
}

document.getElementById("verifyOtp").addEventListener("click", async function () {
  const otp = document.getElementById("otp").value;
  const customerID = await getCustomerID();

  // Gửi OTP để xác thực
  const response = await fetch("http://localhost:5000/api/customer/update-profile/email/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp: otp, customerID: customerID }),
  });

  if (response.ok) {
    localStorage.setItem(
          "notify",
          JSON.stringify({
            type: "success",
            msg: "Email updated successfully!",
          })
        );
    location.reload();
  } else {
    notify({ type: "error", msg: "Invalid OTP."});
  }
});

// const saveNameButton = document.querySelector('#saveNameButton');
// const nameInput = document.querySelector('#nameInput');




// Lấy các phần tử cần thiết
const saveNameButton = document.getElementById('saveNameButton');
const nameInput = document.getElementById('nameInput');

// Gắn sự kiện click vào nút Save Name
saveNameButton.addEventListener('click', async (event) => {
  // Ngăn chặn hành vi submit mặc định của form
  event.preventDefault();

  // Lấy giá trị từ input và customerID
  const newName = nameInput.value.trim();

  

  const customerID = await getCustomerID(); // Giả định hàm này trả về customerID hợp lệ

  console.log('New name:', newName);
  console.log('Customer ID:', customerID);

  if (newName) {
    try {
      // Gửi yêu cầu POST đến API
      const response = await fetch('http://localhost:5000/api/customer/update-profile/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerName: newName, customerID: customerID }),
      });

      // Chuyển đổi kết quả phản hồi thành JSON
      const result = await response.json();

      // Kiểm tra phản hồi
      if (response.ok) {
        localStorage.setItem(
          "notify",
          JSON.stringify({
            type: "success",
            msg: "Name updated successfully!",
          })
        );
        location.reload();
      } else {
        console.error('Error from server:', result.error);
        notify({ type: "error", msg: result.error || "Failed to update name."});
      }
    } catch (error) {
      console.error('Fetch error:', error);
      notify({ type: "error", msg: "An error occurred while updating the name."});
    }
  } else {
    notify({ type: "error", msg: "Please enter a valid name."});
  }
});

document.getElementById("avatarInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("avatarPreview").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("saveAvatar").addEventListener("click", async function (event) {
  event.preventDefault(); // Ngăn hành vi mặc định của nút

  const fileInput = document.getElementById("avatarInput");
  const file = fileInput.files[0];

  if (!file) {
    notify({ type: "error", msg: "Please select an avatar to upload."});
    return;
  }

  const formData = new FormData();
  const customerID = await getCustomerID(); // Giả sử hàm này trả về ID hợp lệ
  formData.append("avatar", file); // File avatar
  formData.append("customerID", customerID); // Thay bằng ID thực tế của người dùng

  try {
    const response = await fetch("http://localhost:5000/api/customer/update-profile/avatar", {
      method: "POST",
      body: formData, // Gửi FormData
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("avatarPreview").src = result.updatedCustomer.customerAvatar; // Cập nhật ảnh mới
      localStorage.setItem(
          "notify",
          JSON.stringify({
            type: "success",
            msg: "Avatar updated successfully!",
          })
      );
      
      location.reload(); // Tải lại trang

    } else {
      notify({ type: "error", msg: result.message || "Failed to update avatar."});
    }
  } catch (error) {
    console.error("Error uploading avatar:", error);
    notify({ type: "error", msg: "An error occurred while updating the avatar."});
  }
});

ddEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("http://localhost:5000/api/customer/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const user = await response.json();

      // Kiểm tra nếu người dùng không có mật khẩu
      if (!user.hasPassword) {
        // Ẩn trường Current Password nếu người dùng chưa có mật khẩu
        document.getElementById("currentPasswordGroup").style.display = "none";
      }
    } else {
      console.error("Failed to fetch user profile");
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
  }
});

document.getElementById("savePasswordButton").addEventListener("click", async function () {
  const currentPasswordField = document.getElementById("currentPassword");
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    notify({ type: "error", msg: "New Password and Confirm Password do not match!"});
    return;
  }

  // verify user input 
  if (!newPassword || newPassword.length < 6) {
    notify({ type: "error", msg: "New password must be at least 6 characters long."});
    return;
  }
  else if (newPassword === currentPasswordField.value) {
    notify({ type: "error", msg: "New password must be different from the current password."});
    return;
  }

  const customerID = await getCustomerID();
  const payload = {
    newPassword: newPassword,
    customerID: customerID,
  };


  if (currentPasswordField && currentPasswordField.offsetParent !== null) {
    payload.currentPassword = currentPasswordField.value;
  }

  try {
    const response = await fetch("http://localhost:5000/api/customer/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem(
          "notify",
          JSON.stringify({
            type: "success",
            msg: "Password updated successfully!",
          })
        );
      location.reload();
    } else {
      notify({ type: "error", msg: result.error || "Failed to update password."});
    }
  } catch (error) {
    console.error("Error changing password:", error);
    notify({ type: "error", msg: "An error occurred. Please try again later."});
  }
});

