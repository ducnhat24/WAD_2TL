var url = "https://watch-shop-nine-beryl.vercel.app";
let user = null;

function showNav() {
  const navBar = document.querySelector(".header__sidebar");
  navBar.style.transform = "translateX(0)";
  navBar.style.opacity = "1";
  const navBtn = document.querySelector(".header__btn__nav");
  navBtn.style.opacity = "0.3";
}

function hideNav() {
  const navBar = document.querySelector(".header__sidebar");
  navBar.style.transform = "translateX(100%)";
  navBar.style.opacity = "0";
  const navBtn = document.querySelector(".header__btn__nav");
  navBtn.style.opacity = "1";
}

function notify(obj) {
  const main = document.getElementById("notify");
  const icons = {
    success: "fa-check",
    error: "fa-info",
    warning: "fa-exclamation",
  };
  if (main) {
    const el = document.createElement("div");
    el.classList.add("notify");
    el.classList.add("notify--" + obj.type);

    el.innerHTML = `
            <div class="notify__icon">
                <i class="fa-solid ${icons[obj.type]}"></i>
            </div>
            <div class="notify__content">
                <div class="notify__content__title">
                    ${obj.type}
                </div>
                <div class="notify__content__msg">
                    ${obj.msg}
                </div>
            </div>
            <div class="notify__close" onClick="closeNotify()">
                <i class="fa-solid fa-x"></i>
            </div>
        `;

    main.appendChild(el);
    setTimeout(() => {
      main.removeChild(main.firstElementChild);
    }, 3500);
  }
}

function closeNotify() {
  const main = document.getElementById("notify");
  main.removeChild(main.firstElementChild);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Check token on load
document.addEventListener("DOMContentLoaded", function () {
  const accessToken = getCookie("accessToken") || "";
  const refreshToken = getCookie("refreshToken") || "";
  console.log("Access token: ", accessToken);
  console.log("Refresh token: ", refreshToken);
  // Fetch authentication status
  fetch(url + "/api/customer/authentication", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify({ refreshToken: refreshToken }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Authentication failed");
      }
      return response.json();
    })
    .then((data) => {
      user = data.user;
      console.log("User: ", user);
      if (data.status === "success") {
        // Token is valid; show logout icon
        document.querySelector(".header__account").innerHTML = `
          <div class="header__account__item">
            <button onclick="handleLogout()">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        `;
        const logoutDiv = document.createElement("div");
        logoutDiv.classList.add("header__item");
        logoutDiv.innerHTML = `
          <button onclick="handleLogout()">Logout</button>
        `;
        const headerFeature = document.querySelector(".header__feature");
        headerFeature.appendChild(logoutDiv);
      } else {
        // Token invalid or missing; show login/signup links
        document.querySelector(".header__account").innerHTML = `
          <div class="header__account__item">
            <a href="/customer/signup">Signup</a>
          </div>
          <div class="header__account__item">
            <a href="/customer/login">Login</a>
          </div>
        `;
        const loginDiv = document.createElement("div");
        loginDiv.classList.add("header__item");
        loginDiv.innerHTML = `
          <a href="/customer/login">Login</a>
        `;

        const signupDiv = document.createElement("div");
        signupDiv.classList.add("header__item");
        signupDiv.innerHTML = `
          <a href="/customer/signup">Signup</a>
        `;

        const headerFeature = document.querySelector(".header__feature");
        headerFeature.appendChild(signupDiv);
        headerFeature.appendChild(loginDiv);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Show login/signup if there's an error
      document.querySelector(".header__account").innerHTML = `
        <div class="header__account__item">
          <a href="/customer/signup">Signup</a>
        </div>
        <div class="header__account__item">
          <a href="/customer/login">Login</a>
        </div>
      `;
    });
});
function validateEmail() {
  const email = document.getElementById("signup__email").value;
  const errorSpan = document.getElementById("email-error");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorSpan.style.display = "block";
  } else {
    errorSpan.style.display = "none";
  }
}
function validatePassword() {
  const password = document.getElementById("signup__password").value;
  const errorSpan = document.getElementById("password-error");
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    errorSpan.style.display = "block";
  } else {
    errorSpan.style.display = "none";
  }
}


function handleSubmitLogin() {
  const useraccount = document.querySelector("#login__useraccount").value;
  const password = document.querySelector("#login__password").value;
  if (!useraccount || !password) {
    notify({
      type: "warning",
      msg: "Please fill all fields",
    });
    return;
  }

  // Send data to server
  fetch(url + "/api/customer/login", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ useraccount, password }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        mergeCartsAfterLogin();
        localStorage.setItem(
          "notify",
          JSON.stringify({
            type: data.status,
            msg: data.msg,
          })
        );
        location.href = "/";
      } else {
        notify({ type: data.status, msg: data.msg });
      }
    })
    .catch((error) => {
      alert("There was an error processing your request.");
    });
}

function handleLogout() {
  console.log("Logout form submitted");
  fetch(url + "/api/customer/logout", {
    credentials: "include",
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log(document.cookie);
      if (data.status === "success") {
        localStorage.setItem(
          "notify",
          JSON.stringify({
            type: data.status,
            msg: data.msg,
          })
        );

        location.href = "/";
      }
    })
    .catch((error) => {
      notify({
        type: "error",
        msg: error.message,
      });
    });
}

$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
  });
});

// function handleSearch() {
//   const query = document.querySelector("#search__bar__product").value;
//   console.log("Search query: ", query);
//   if (!query) {
//     notify({
//       type: "warning",
//       msg: "Please enter a search query",
//     });
//     return;
//   }

//   location.href = "/product/search?keysearch=" + query;
//   // Send data to server
// }

function handleSearch() {
  const query = document.querySelector("#search__bar__product").value;
  const selectedBrands = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  ).map((checkbox) => checkbox.id.replace("checkbox_", ""));
  const selectedSort =
    document.querySelector("input[name=sort]:checked")?.id || "";
  const priceRange = document.querySelector("input[type=range]").value;

  // Kiểm tra nếu không có từ khóa tìm kiếm
  if (!query) {
    notify({
      type: "warning",
      msg: "Please enter a search query",
    });
    return;
  }

  // Tạo query string từ các giá trị đã thu thập
  const queryParams = {
    keysearch: query,
    brands: selectedBrands.join(","), // Chuyển mảng thành chuỗi
    sort: selectedSort,
    price: priceRange,
  };

  // Chuyển các giá trị vào URL query string
  const queryString = new URLSearchParams(queryParams).toString();

  // Điều hướng đến trang tìm kiếm với các tham số đã chọn
  location.href = "/product/search?" + queryString;
}

function handleFilter() {
  // Select all checkboxesBrand in the container
  const checkboxesBrand = document.querySelectorAll(
    '#brand-filter input[type="checkbox"]'
  );
  console.log(checkboxesBrand);
  // Filter checked checkboxesBrand and retrieve their associated label text
  const selectedBrands = Array.from(checkboxesBrand)
    .filter((checkbox) => checkbox.checked) // Only checked checkboxesBrand
    .map((checkbox) => {
      // Find the associated label using the 'for' attribute
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      return label ? label.textContent.trim() : null; // Get the label text
    })
    .filter((brand) => brand !== null); // Remove null values in case of missing labels

  // Output the selected brands
  console.log("Selected Brands:", selectedBrands);

  const checkboxesModel = document.querySelectorAll(
    '#model-filter input[type="checkbox"]'
  );
  const selectedModels = Array.from(checkboxesModel)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      return label ? label.textContent.trim() : null;
    })
    .filter((model) => model !== null);

  // Use the `selectedBrands` array for filtering logic

  const radiosSort = document.querySelectorAll(
    '#sort-filter input[type="radio"]'
  );

  const selectedSort = Array.from(radiosSort).find((radio) => radio.checked);

  if (selectedSort) {
    const sortID = selectedSort.id;
    const sortTypeQuery = sortID.split("_")[1];
    const sortByQuery = sortID.split("_")[2];
    console.log("Selected Sort:", sortTypeQuery, sortByQuery);
  }

  let endpoint = "/product";
  console.log(endpoint);
  if (selectedBrands.length > 0 || selectedModels.length > 0 || selectedSort) {
    endpoint += "/filter?";
  }

  let flag = false;
  if (selectedBrands.length > 0) {
    flag = true;
    endpoint += "brands=" + selectedBrands.join(",");
  }

  if (flag) {
    endpoint += "&";
  }

  if (selectedModels.length > 0) {
    flag = true;
    endpoint += "models=" + selectedModels.join(",");
  }

  if (flag) {
    endpoint += "&";
  }

  if (selectedSort) {
    endpoint +=
      "sortby=" +
      selectedSort.id.split("_")[1] +
      "&sorttype=" +
      selectedSort.id.split("_")[2];
  }

  console.log(endpoint);
  location.href = endpoint;
}

const storedNotify = localStorage.getItem("notify");
if (storedNotify) {
  const notifyObject = JSON.parse(storedNotify);
  notify(notifyObject);
  // Clear the stored notification
  localStorage.removeItem("notify");
}

async function mergeCartsAfterLogin() {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (localCart.length > 0) {
        try {
            const response = await fetch(url + "/api/customer/cart/merge", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    localCart: localCart.map(item => ({
                        productId: item._id,
                        quantity: item.quantity
                    }))
                })
            });
            
            const data = await response.json();
            if (data.status === 'success') {
                localStorage.removeItem('cart');
                updateCartCount();
            }
        } catch (error) {
            console.error('Error merging carts:', error);
        }
    }
}

function isUserLoggedIn() {
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => cookie.trim().startsWith('accessToken='));
}


function updateCartCount(increment = 1) {
    const cartCountElement = document.getElementById('cart-count');
    if (isUserLoggedIn()) {
        // Get server cart count
        fetch(url + "/api/customer/cart", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            let totalCount = 0;
            for (const item of data.cart) {
                if (item !== null) {
                    totalCount += item.quantity;
                }
            }
            cartCountElement.innerText = totalCount;
        })
        .catch(error => {
            console.error('Error updating cart count:', error);
        });
    } else {
        // Get local cart count
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalCount = localCart.reduce((sum, item) => {
            return sum + (item !== null ? item.quantity : 0);
        }, 0);
        cartCountElement.innerText = totalCount;
    }
}

function handleGoogleLogin() {
  // Xử lý logic đăng nhập qua Google
  console.log("Google login clicked");
  // Redirect hoặc mở popup tương ứng
  window.location.href = url + "/api/customer/auth/google"; // Điều hướng đến endpoint xử lý Google OAuth
}



document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('loginSuccess');

    if (loginSuccess === 'true') {
        mergeCartsAfterLogin(); // Merge cart khi đăng nhập Google thành công
        localStorage.setItem(
            "notify",
            JSON.stringify({
                type: "success",
                msg: "Google login successful!",
            })
        );
        updateCartCount();
        history.replaceState(null, '', '/'); // Xóa query string khỏi URL
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Kiểm tra trạng thái đăng nhập thông qua Cookies
    const isLoggedIn = !!Cookies.get("accessToken");

    if (!isLoggedIn) {
        // Ẩn icon profile và order nếu chưa đăng nhập
        const userIcon = document.querySelector(".fa-user");
        const orderIcon = document.querySelector(".fa-file-invoice");

        if (userIcon) userIcon.style.display = "none";
        if (orderIcon) orderIcon.style.display = "none";
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartCount();
});
