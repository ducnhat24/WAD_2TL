 document.getElementById("forgotPasswordLink").addEventListener("click", function () {
    document.getElementById("popupOverlay").classList.add("active");
    document.getElementById("forgotPasswordPopup").classList.add("active");
  });

  document.getElementById("closePopupButton").addEventListener("click", function () {
    document.getElementById("popupOverlay").classList.remove("active");
    document.getElementById("forgotPasswordPopup").classList.remove("active");
  });
  let email = document.getElementById("emailInput").value;
  document.getElementById("sendOtpButton").addEventListener("click", async function () {
    email = document.getElementById("emailInput").value;
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/customer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      if (response.ok) {
        alert("OTP sent successfully!");
        document.getElementById("stepEmail").style.display = "none";
        document.getElementById("stepOtp").style.display = "block";
      } else {
        alert(result.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  });

  document.getElementById("verifyOtpButton").addEventListener("click", async function () {
    const otp = document.getElementById("otpInput").value;
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/customer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp })
      });

      const result = await response.json();
      if (response.ok) {
        alert("OTP verified successfully!");
        document.getElementById("stepOtp").style.display = "none";
        document.getElementById("stepResetPassword").style.display = "block";
      } else {
        alert(result.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  });

  document.getElementById("resetPasswordButton").addEventListener("click", async function () {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/customer/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword, email: email })
      });

      const result = await response.json();
      if (response.ok) {
        alert("Password reset successfully!");
        document.getElementById("closePopupButton").click();
      } else {
        alert(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  });

