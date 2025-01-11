document.getElementById("saveEmail").addEventListener("click", async function () {
  const email = document.getElementById("email").value;

  // Gửi email để lấy mã OTP
  const response = await fetch("http://localhost:5000/api/customer/update-profile/email/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    document.getElementById("otpSection").style.display = "block";
  } else {
    alert("Failed to send verification email.");
  }
});

async function getCustomerID() {
    try {
        const response = await fetch('http://localhost:5000/api/customer/id');
        if (!response.ok) {
            throw new Error(`Error fetching customer ID: ${response.status}`);
        }
        if (response.status == "error") {
            alert("Please login first to write a review!");
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
    alert("Email updated successfully!");
    location.reload();
  } else {
    alert("Invalid OTP.");
  }
});