// FETCHING AND RENDERING ORDERS

let ordersData = []; // Biến toàn cục lưu trữ danh sách đơn hàng

async function fetchOrders() {
    try {
        const response = await fetch(`http://localhost:5000/api/customer/order`);
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        ordersData = data.data; // Lưu toàn bộ dữ liệu
        totalPages = Math.ceil(ordersData.length / pageSize);
        renderOrders(ordersData); // Render trang đầu tiên

        //get id order__count
        const orderCount = document.getElementById('order__count');
        orderCount.textContent = `Total of ${ordersData.length} order(s)`;
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

fetchOrders();

function renderOrders(orders) {
    const orderTableData = document.querySelector('.order__table__data');
    orderTableData.innerHTML = ''; // Xóa dữ liệu cũ

    // Định nghĩa màu sắc cho từng trạng thái
    const statusColors = {
        Processing: 'blue',
        Pending: 'orange',
        Delivered: 'purple',
        Completed: 'green',
        Cancelled: 'red'
    };

    // Xử lý phân trang
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    if (paginatedOrders.length === 0) {
        const row = `
            <div class="order__table__items">
                <div class="order__table__item" style="text-align: center;" colspan="5">No orders found</div>
            </div>
        `;
        orderTableData.insertAdjacentHTML('beforeend', row);
        // print empty row
        for (let i = 0; i < pageSize - paginatedOrders.length - 1; i++) {
            const row = `
                <div class="order__table__items">
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                </div>
            `;
            orderTableData.insertAdjacentHTML('beforeend', row);
        }
        return;
    }

    paginatedOrders.forEach(order => {
        const totalProducts = order.orderListProduct.reduce((sum, product) => sum + product.quantity, 0);
        const statusColor = statusColors[order.orderStatus] || 'gray'; // Mặc định là 'gray' nếu không có trạng thái phù hợp

        const row = `
            <div class="order__table__items">
                <div class="order__table__item">${order._id}</div>
                <div class="order__table__item">${totalProducts}</div>
                <div class="order__table__item">${order.orderTotalPrice.toLocaleString('vi-VN')} đ</div>
                <div class="order__table__item">${new Date(order.orderCreatedDateTime).toLocaleString()}</div>
                <div class="order__table__item">
                    <div class="order__table__item__icon" style="background-color: ${statusColor};"></div>
                    <div class="order__table__item__status">${order.orderStatus}</div>
                </div>
            </div>
        `;
        orderTableData.insertAdjacentHTML('beforeend', row);
    });

    //handle when number of orders is less than pageSize: add empty rows
    if (paginatedOrders.length < pageSize) {
        for (let i = 0; i < pageSize - paginatedOrders.length; i++) {
            const row = `
                <div class="order__table__items">
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                    <div class="order__table__item" style="visibility: hidden;">Hidden</div>
                </div>
            `;
            orderTableData.insertAdjacentHTML('beforeend', row);
        }
    }

    // Cập nhật số trang
    updatePaginationControls(orders.length);
}

const sortStates = {
    id: 'desc',
    products: 'desc',
    price: 'desc',
    time: 'desc',
    status: 'desc'
};

function sortAndRender(column) {
    let isAscending = sortStates[column] === 'asc';
    
    // Sắp xếp dữ liệu
    ordersData.sort((a, b) => {
        switch (column) {
            case 'id':
                return isAscending ? a._id.localeCompare(b._id) : b._id.localeCompare(a._id);
            case 'products':
                const totalProductsA = a.orderListProduct.reduce((sum, product) => sum + product.quantity, 0);
                const totalProductsB = b.orderListProduct.reduce((sum, product) => sum + product.quantity, 0);
                return isAscending ? totalProductsA - totalProductsB : totalProductsB - totalProductsA;
            case 'price':
                return isAscending ? a.orderTotalPrice - b.orderTotalPrice : b.orderTotalPrice - a.orderTotalPrice;
            case 'time':
                return isAscending
                    ? new Date(a.orderCreatedDateTime) - new Date(b.orderCreatedDateTime)
                    : new Date(b.orderCreatedDateTime) - new Date(a.orderCreatedDateTime);
            case 'status':
                return isAscending ? a.orderStatus.localeCompare(b.orderStatus) : b.orderStatus.localeCompare(a.orderStatus);
        }
    });

    // Đảo ngược trạng thái
    sortStates[column] = isAscending ? 'desc' : 'asc';

    // Render lại bảng
    renderOrders(ordersData);
    updateAllSortIndicators();
}

function updateAllSortIndicators() {
    Object.keys(sortStates).forEach(column => {
        const header = document.getElementById(`sort-${column}`);
        const state = sortStates[column];
        if (state === 'asc') {
            header.classList.add('sort-asc');
            header.classList.remove('sort-desc');
        } else {
            header.classList.add('sort-desc');
            header.classList.remove('sort-asc');
        }
    });
}

// Gắn sự kiện cho tất cả các cột
document.getElementById('sort-id').addEventListener('click', () => sortAndRender('id'));
document.getElementById('sort-products').addEventListener('click', () => sortAndRender('products'));
document.getElementById('sort-price').addEventListener('click', () => sortAndRender('price'));
document.getElementById('sort-time').addEventListener('click', () => sortAndRender('time'));
document.getElementById('sort-status').addEventListener('click', () => sortAndRender('status'));

// Hiển thị trạng thái ban đầu
updateAllSortIndicators();




// PAGINATION
let pageSize = 8; // Số dòng trên mỗi trang
let currentPage = 1; // Trang hiện tại
let totalPages = 0;

function paginateOrders(data, page, pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end); // Lấy dữ liệu cho trang hiện tại
}

function updatePaginationControls(totalOrders) {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = ''; // Xóa các nút phân trang cũ

    const totalPages = Math.ceil(totalOrders / pageSize);

    // Tạo một div chứa các nút phân trang
    const wrapper = document.createElement('div');
    wrapper.classList.add('pagination-wrapper'); // Thêm class để CSS

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active'); // Đánh dấu trang hiện tại
        }

        button.addEventListener('click', () => {
            currentPage = i; // Cập nhật trang hiện tại
            renderOrders(ordersData); // Render lại dữ liệu
        });

        wrapper.appendChild(button);
    }

    paginationControls.appendChild(wrapper); // Thêm wrapper vào controls
}


document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderOrders(ordersData);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage * pageSize < ordersData.length) {
        currentPage++;
        renderOrders(ordersData);
    }
});


// FILTER ORDER
document.getElementById('status-options').addEventListener('change', (event) => {
    const selectedStatus = event.target.value; // Lấy giá trị status được chọn
    filterOrdersByStatus(selectedStatus); // Gọi hàm lọc
});

function filterOrdersByStatus(status) {
    if (!ordersData || ordersData.length === 0) return;

    let filteredOrders;
    if (status === "") {
        // Nếu chọn option mặc định (không lọc), hiển thị tất cả đơn hàng
        filteredOrders = ordersData;
    } else {
        // Lọc đơn hàng theo status
        filteredOrders = ordersData.filter(order => order.orderStatus.toLowerCase() === status.toLowerCase());
    }

    // Render lại bảng với dữ liệu đã lọc
    renderOrders(filteredOrders);
}

//SEARCH ORDER
document.getElementById('search-order').addEventListener('input', (event) => {
    const searchValue = event.target.value.trim(); // Lấy giá trị tìm kiếm
    searchOrderById(searchValue); // Gọi hàm tìm kiếm
});

function searchOrderById(searchValue) {
    if (!ordersData || ordersData.length === 0) return;

    let filteredOrders;
    if (searchValue === "") {
        // Nếu ô tìm kiếm trống, hiển thị tất cả đơn hàng
        filteredOrders = ordersData;
    } else {
        // Lọc đơn hàng có ID chứa giá trị tìm kiếm (không phân biệt chữ hoa/thường)
        filteredOrders = ordersData.filter(order =>
            order._id.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    // Render lại bảng với dữ liệu đã lọc
    renderOrders(filteredOrders);
}

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

// Sử dụng debounce cho sự kiện tìm kiếm
document.getElementById('search-order').addEventListener(
    'input',
    debounce((event) => {
        const searchValue = event.target.value.trim();
        searchOrderById(searchValue);
    }, 300) // Chỉ tìm kiếm sau 300ms người dùng dừng nhập
);


// PAGE SIZE
document.getElementById('page-size').addEventListener('change', (event) => {
    pageSize = parseInt(event.target.value, 10); // Cập nhật kích thước trang
    currentPage = 1; // Reset về trang đầu tiên
    renderOrders(ordersData); // Render lại với page size mới
});




// // SORT IN SELECT
// document.getElementById('sort-options').addEventListener('change', (event) => {
//     const selectedOption = event.target.value; // Lấy giá trị của tùy chọn
//     switch (selectedOption) {
//         case 'id':
//             sortAndRender('id');
//             break;
//         case 'num-of-products':
//             sortAndRender('products');
//             break;
//         case 'creation-time':
//             sortAndRender('time');
//             break;
//         case 'price':
//             sortAndRender('price');
//             break;
//         case 'status':
//             sortAndRender('status');
//             break;
//         default:
//             console.error('Unknown sort option:', selectedOption);
//     }
// });
