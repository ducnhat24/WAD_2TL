const fetchURL = process.env.FETCH_URL;

async function getCustomerID() {
    try {
        const response = await fetch(fetchURL + '/api/customer/id');
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

async function fetchAllReviews(productId) {
    try {
        const response = await fetch(fetchURL +`/api/product/${productId}/reviews`);
        if (!response.ok) {
            throw new Error(`Error fetching reviews: ${response.status}`);
        }
        const data = await response.json();
        return data; // Trả về danh sách review từ API
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
    const reviewsPerPage = 5; // Số review mỗi trang
    let currentPage = 1;

    const allReviews = await fetchAllReviews(productId);

    function updatePage(page) {
        currentPage = page;
        const reviewsToShow = paginateReviews(allReviews, currentPage, reviewsPerPage);
        const reviewContainer = document.querySelector('.card-review');
        renderReviews(reviewsToShow, reviewContainer);

        renderPagination(allReviews.length, reviewsPerPage, currentPage, updatePage);
    }

    updatePage(currentPage); // Hiển thị trang đầu tiên
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
        if (customerID === null) {
            alert("Please login first to write a review!");

            return; // Nếu không lấy được customer ID thì dừng
        }

        try {
            // Gửi dữ liệu đến server
            const response = await fetch(fetchURL +`/api/product/${productId}/reviews`, {
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
                const reviews = await fetchAllReviews(productId); // Lấy review mới
                const lastPage = Math.ceil(reviews.length / 5); // Tính trang cuối
                const slicedReview = paginateReviews(reviews, lastPage, 5); // Hiển thị trang đầu tiên
                renderReviews(slicedReview, document.querySelector('.card-review')); // Hiển thị review mới
                // location.reload(); // Reload trang để hiển thị review mới
            } else {
                alert(`Error: ${result.msg}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    });
});

function paginateReviews(reviews, page, reviewsPerPage) {
    const startIndex = (page - 1) * reviewsPerPage; // Vị trí bắt đầu
    const endIndex = startIndex + reviewsPerPage;  // Vị trí kết thúc
    return reviews.slice(startIndex, endIndex);    // Lấy phần tử trong khoảng [startIndex, endIndex)
}

function renderPagination(totalReviews, reviewsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // Xóa nội dung cũ

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-btn';
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => onPageChange(i));
        paginationContainer.appendChild(pageButton);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadReviews();
});
