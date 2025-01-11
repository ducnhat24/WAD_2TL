async function getCustomerID() {
    try {
        const response = await fetch('http://localhost:5000/api/customer/id');
        if (!response.ok) {
            throw new Error(`Error fetching customer ID: ${response.status}`);
            // return null;
        }
        const data = await response.json();
        return data.data._id; // Trả về dữ liệu customer ID từ API
    }
    catch (error) {
        console.error("Error fetching customer ID:", error);
        return null; // Trả về null nếu có lỗi
    }
}


async function fetchReviews(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/product/${productId}/reviews`);
        if (!response.ok) {
            throw new Error(`Error fetching reviews: ${response.status}`);
        }
        const data = await response.json();
        return data; // Trả về dữ liệu review từ API
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
}

function renderReviews(reviews, reviewContainer) {
    reviewContainer.innerHTML = ""; // Xóa nội dung cũ

    if (reviews.length > 0) {
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review-item');
            reviewElement.innerHTML = `
                <div class="review-row">
                    <div class="customer-review">
                        <strong>Customer name:</strong> ${review.customerID !== null? review.customerID.customerName : "Anonymous"}
                    </div>
                    <div class="review-header">
                        <strong>Rating:</strong> ${review.productReviewRating} / 5
                    </div>
                </div>
                <div class="review-content">
                    <strong>Comment:</strong> ${review.productReviewContent}
                </div>
            `;
            reviewContainer.appendChild(reviewElement);
        });
    } else {
        reviewContainer.innerHTML = `<p id="no-review-paragraph">No reviews available for this product.</p>`;
    }
}

async function loadReviews() {
    const productId = document.getElementById('hehe').innerText.trim();

    fetchReviews(productId)
        .then(reviews => {
            const reviewContainer = document.querySelector('.card-review');
            renderReviews(reviews, reviewContainer);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const productId = document.getElementById('hehe').innerText.trim(); // Lấy Product ID từ HTML
    const reviewForm = document.getElementById('reviewForm'); // Form để người dùng viết review
    const ratingInputs = reviewForm.querySelectorAll('input[name="rating"]'); // Các input rating

    // Gửi review
    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Ngăn form reload trang

        // Lấy dữ liệu từ form
        const reviewContent = reviewForm.querySelector('#comment').value.trim(); // Nội dung review
        const reviewRating = [...ratingInputs].find(input => input.checked)?.value; // Giá trị rating (ngôi sao được chọn)

        // Kiểm tra dữ liệu trước khi gửi
        if (!reviewContent || !reviewRating) {
            alert('Please provide valid review content and select a rating.');
            return;
        }

        const customerID = await getCustomerID(); // Lấy customer ID từ API

        try {
            // Gửi dữ liệu đến server
            const response = await fetch(`http://localhost:5000/api/product/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerID: customerID,
                    productReviewContent: reviewContent,
                    productReviewRating: parseInt(reviewRating), // Chuyển rating thành số nguyên
                }),
            });

            const result = await response.json();
            console.log("result", result);

            if (response.ok) {
                alert('Review submitted successfully!');
                reviewForm.reset(); // Xóa nội dung form
                location.reload(); // Reload trang để hiển thị review mới
            } else {
                alert(`Error: ${result.msg}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    });
});



loadReviews();

// document.addEventListener("DOMContentLoaded", async function () {
//     const productId = document.getElementById('hehe').innerText.trim(); // Lấy product ID từ HTML
//     const reviewContainer = document.querySelector('.card-review'); // Vùng hiển thị review
//     console.log("hehe");
//     // Gọi API để lấy review và hiển thị chúng
//     const reviews = await fetchReviews(productId);
//     renderReviews(reviews, reviewContainer);
// });
