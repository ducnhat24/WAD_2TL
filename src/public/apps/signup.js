// Show OTP overlay
function showOtpOverlay() {
  document.getElementById("otpOverlay").style.display = "block";
  document.getElementById("otpPopup").style.display = "block";
}

// Close OTP overlay
function closeOtpOverlay() {
  document.getElementById("otpOverlay").style.display = "none";
  document.getElementById("otpPopup").style.display = "none";
}

// Attach events
document.getElementById("closeOtpPopupButton").addEventListener("click", closeOtpOverlay);
document.getElementById("verifyOtpButton").addEventListener("click", function () {
  const otp = document.getElementById("otpInput").value.trim();
  if (otp === "") {
    notify({ type: "error", msg: "Please enter the OTP!" });
    return;
  }
  // Handle OTP verification logic here
  console.log("OTP entered:", otp);
  closeOtpOverlay();
});

// Trigger overlay after signup
function handleSubmitSignup() {
  // Validate form fields here...

}


// function handleSubmitSignup() {
//   //console.log("Signup form submitted");
//   const username = document.querySelector("#signup__username").value;
//   const email = document.querySelector("#signup__email").value;
//   const password = document.querySelector("#signup__password").value;
//   if (!email || !password || !username) {
//     notify({
//       type: "warning",
//       msg: "Please fill all fields",
//     });
//     return;
//   }

// function handleSubmitSignup() {
//   //console.log("Signup form submitted");
// //   const username = document.querySelector("#signup__username").value;
// //   const email = document.querySelector("#signup__email").value;
// //   const password = document.querySelector("#signup__password").value;
// //   if (!email || !password || !username) {
// //     notify({
// //       type: "warning",
// //       msg: "Please fill all fields",
// //     });
// //     return;
// //     }
    
//     console.log("Form submitted. Sending OTP...");
//     showOtpOverlay(); // Show OTP overlay after form submission

//   // Send data to server
// //   fetch(url + "/api/customer/signup", {
// //     credentials: "include",
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({ username, email, password }),
// //   })
// //     .then((res) => {
// //       if (!res.ok) {
// //         throw new Error("Network response was not ok");
// //       }
// //       return res.json();
// //     })
// //     .then((data) => {
// //       if (data.status === "success") {
// //         localStorage.setItem(
// //           "notify",
// //           JSON.stringify({
// //             type: data.status,
// //             msg: data.msg,
// //           })
// //         );
// //         location.href = "login";
// //       }
// //     })
// //     .catch((error) => {
// //       notify({
// //         type: "error",
// //         msg: error.message,
// //       });
// //     });
// }


async function handleSubmitSignup() {
  const username = document.querySelector("#signup__username").value.trim();
  const email = document.querySelector("#signup__email").value.trim();
  const password = document.querySelector("#signup__password").value;

  // Kiểm tra dữ liệu đầu vào
  if (!email || !password || !username) {
    notify({
      type: "warning",
      msg: "Please fill all fields",
    });
    return;
  }

  try {
    // Gửi yêu cầu OTP qua email
    const response = await fetch("http://localhost:5000/api/customer/send-otp-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (response.ok) {
      notify({ type: "success", msg: "OTP sent successfully! Please check your email." });
      showOtpOverlay(); // Hiển thị overlay nhập OTP
    } else {
      notify({
        type: "error",
        msg: result.message || "Failed to send OTP.",
      });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    notify({
      type: "error",
      msg: "An error occurred while sending OTP.",
    });
  }
}



document.getElementById("verifyOtpButton").addEventListener("click", async function () {
  const otp = document.getElementById("otpInput").value.trim();
  const username = document.querySelector("#signup__username").value.trim();
  const customerEmail = document.querySelector("#signup__email").value.trim();
  const customerPassword = document.querySelector("#signup__password").value;

  if (!otp) {
    notify({ type: "error", msg: "Please enter the OTP." });
    return;
  }

  try {
    // Gửi yêu cầu xác thực OTP với payload mở rộng
    const response = await fetch("http://localhost:5000/api/customer/verify-otp-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, username, customerEmail, customerPassword }),
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem(
          "notify",
          JSON.stringify({
            type: "success",
            msg: "Account created successfully!",
          })
        );
      document.getElementById("closeOtpPopupButton").click();
      location.href = "/customer/login"; // Điều hướng tới trang login
    } else {
      notify({
        type: "error",
        msg: result.message || "Invalid OTP.",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    notify({
      type: "error",
      msg: "An error occurred while verifying OTP.",
    });
  }
});
