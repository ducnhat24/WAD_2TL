let currentPage = 1; // Current page number
let limit = 5;       // Items per page
let totalPages = 0;  // Total number of pages
const cache = new Map(); // Cache to store prefetched pages
let searchQuery = ''; // Search query
let selectedBrands = []; // Selected brands
let selectedCategories = []; // Selected categories
let selectedSort = ''; // Selected sort type


function addCart() {
    // Add item to cart
    const idContainer = document.getElementById("hehe");
    let quantity = 1;
    const quantityContainer = document.getElementById("each-production-quanity");
    if (quantityContainer.value === "") {
        notify({type: "warning", msg: "Please fill in a number of product"})
        return;
    }
    if (!isNaN(quantityContainer.value) && Number(quantityContainer.value) > 0) {
        quantity = Number(quantityContainer.value);
    }
    fetch("http://localhost:5000/api/customer/cart", {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productID: idContainer.innerText,
            quantity: quantity,
        })
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            notify({ type: data.status, msg: data.msg });
        })
        .then(() => {
            updateCartCount();
        })
        .catch(error => console.error('Error adding to cart:', error));
    
}

function updateCartCount(increment = 1) {
    fetch("http://localhost:5000/api/customer/cart", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            const cartCount = document.getElementById('cart-count');
            var __cart_count = 0;
            for (const item of data.cart) {
              if (item !== null) {
                __cart_count += item.quantity;
                }
            }
            cartCount.innerText = __cart_count;
        });
}


function loadProducts() {
    const queryParams = getQueryParams();
    
    // Check if there are any filter parameters
    const hasFilters = queryParams.brands.length > 0 || 
                      queryParams.categories.length > 0 || 
                      queryParams.sortType || 
                      queryParams.keysearch;

    if (hasFilters) {
        // If there are filters, use filter API endpoint
        const filterPayload = {
            page: currentPage,
            limit: limit,
            brands: queryParams.brands,
            categories: queryParams.categories,
            sortType: queryParams.sortType,
            sortBy: queryParams.sortBy
        };

        if (queryParams.keysearch) {
            // If there's a search query, use search endpoint
            handleSearchWithParams(queryParams.keysearch);
        } else {
            // Otherwise use filter endpoint
            applyFilters(filterPayload);
        }
    } else if (cache.has(currentPage)) {
        renderProducts(cache.get(currentPage));
        updateURL({ page: currentPage, limit });
    } else {
        // No filters, load regular products
        showSpinner();
        fetch(`http://localhost:5000/api/product/limitation`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: currentPage, limit: limit })
        })
            .then(response => response.json())
            .then(data => {
                hideSpinner();
                const { totalPages: total, item } = data;
                totalPages = total;
                cache.set(currentPage, item);
                renderProducts(item);
                prefetchPage(currentPage + 1);
                updateURL({ page: currentPage, limit });
            })
            .catch(error => console.error('Error loading products:', error));
    }
}

function handleSearchWithParams(query) {
    showSpinner();
    fetch(`http://localhost:5000/api/product/search`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            keysearch: query,
            page: currentPage,
            limit: limit
        })
    })
        .then(res => res.json())
        .then(data => {
            hideSpinner();
            if (data.item.length === 0) {
                notify({
                    type: "warning",
                    msg: "No results found"
                });
                resetPagination();
            } else {
                totalPages = data.totalPages;
                cache.clear();
                cache.set(currentPage, data.item);
                renderProducts(data.item);
                prefetchPage(currentPage + 1);
            }
        })
        .catch(error => {
            hideSpinner();
            notify({
                type: "error",
                msg: error.message
            });
        });
}

function applyFilters(filterPayload) {
    showSpinner();
    fetch('http://localhost:5000/api/product/filter', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterPayload)
    })
        .then(response => response.json())
        .then(data => {
            hideSpinner();
            const { totalPages: total, item } = data;
            totalPages = total;
            cache.clear();
            cache.set(currentPage, item);
            renderProducts(item);
            prefetchPage(currentPage + 1);
        })
        .catch(error => console.error('Error filtering products:', error));
}

function resetPagination() {
    document.getElementById('page-info').textContent = `Page 0 of 0`;
    document.getElementById('prev-btn').disabled = true;
    document.getElementById('next-btn').disabled = true;
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = '';
}

// Modify the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    const queryParams = getQueryParams();

    // Update UI based on URL parameters
    if (queryParams.keysearch) {
        document.querySelector('#search__bar__product').value = queryParams.keysearch;
    }

    // Load sidebar first so checkboxes exist
    loadSideBar().then(() => {
        // After sidebar is loaded, set the checkboxes
        queryParams.brands.forEach(brand => {
            const checkbox = document.getElementById(`checkbox_${brand}`);
            if (checkbox) checkbox.checked = true;
        });

        queryParams.categories.forEach(category => {
            const checkbox = document.getElementById(`checkbox_${category}`);
            if (checkbox) checkbox.checked = true;
        });

        if (queryParams.sortType) {
            const radio = document.getElementById(`sort_${queryParams.sortType}`);
            if (radio) radio.checked = true;
        }

        // Set current page and limit
        currentPage = queryParams.page;
        limit = queryParams.limit;

        // Load products with filters
        loadProducts();
    });
});

// Modify loadSideBar to return a promise
function loadSideBar() {
    return Promise.all([
        new Promise((resolve) => {
            const brandFilterArea = document.getElementById('brand-filter');
            brandFilterArea.innerHTML = ''; // Clear existing content
            
            fetch('http://localhost:5000/api/brand', {
                credentials: 'include',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(data => {
                    data.data.forEach(brand => {
                        const brandElement = document.createElement('div');
                        brandElement.innerHTML = `
                            <div class="custom-checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="checkbox_${brand._id}" 
                                    class="custom-checkbox">
                                <label class="custom-label" for="checkbox_${brand._id}">${brand.brandName}</label>
                            </div>
                        `;
                        // Kiểm tra xem phần tử đã có chưa, nếu chưa thì thêm
                        if (!document.getElementById(`checkbox_${brand._id}`)) {
                            brandFilterArea.appendChild(brandElement);
                        }
                        // brandFilterArea.appendChild(brandElement);
                    });
                    resolve();
                })
                .catch(error => {
                    console.error('Error loading brands:', error);
                    resolve();
                });
        }),
        new Promise((resolve) => {
            const categoryFilterArea = document.getElementById('category-filter');
            categoryFilterArea.innerHTML = ''; // Clear existing content
            
            fetch('http://localhost:5000/api/category', {
                credentials: 'include',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(data => {
                    data.data.forEach(category => {
                        const categoryElement = document.createElement('div');
                        categoryElement.innerHTML = `
                            <div class="custom-checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="checkbox_${category._id}" 
                                    class="custom-checkbox">
                                <label class="custom-label" for="checkbox_${category._id}">${category.categoryName}</label>
                            </div>
                        `;
                        // Kiểm tra xem phần tử đã có chưa, nếu chưa thì thêm
                        if (!document.getElementById(`checkbox_${category._id}`)) {
                            categoryFilterArea.appendChild(categoryElement);
                        }
                        // categoryFilterArea.appendChild(categoryElement);
                    });
                    resolve();
                })
                .catch(error => {
                    console.error('Error loading categories:', error);
                    resolve();
                });
        })
    ]);
}

// Update prefetchPage to handle search queries
function prefetchPage(page) {
    // if (cache.has(page) || page > totalPages || page < 1) return;

    const searchQuery = document.querySelector("#search__bar__product").value;
    const url = searchQuery 
      ? 'http://localhost:5000/api/product/search'
      : 'http://localhost:5000/api/product/limitation';
    
    const payload = searchQuery 
      ? { keysearch: searchQuery, page, limit }
      : { page, limit };

    fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            cache.set(page, data.item);
        })
        .catch(error => console.error(`Error prefetching page ${page}:`, error));
}

function updateURL({
    page = 1,
    limit = 10,
    keysearch = '',
    brands = [],
    categories = [],
    sortType = '',
    sortBy = ''
} = {}) {
    const queryParams = new URLSearchParams();

    // const searchQuery = document.querySelector("#search__bar__product").value;

    // Add pagination parameters
    if (page) queryParams.set('page', page);
    if (limit) queryParams.set('limit', limit);

    // Add search query if it exists
    if (keysearch) queryParams.set('keysearch', keysearch);

    // Add filters for brands and categories
    if (brands.length > 0) {
        queryParams.set('brands', brands.join(','));
    }

    if (categories.length > 0) {
        queryParams.set('categories', categories.join(','));
    }

    // Add sorting parameters if provided
    if (sortType) queryParams.set('sortType', sortType);
    if (sortBy) queryParams.set('sortBy', sortBy);

    // Update the URL in the browser without reloading
    const newURL = `${window.location.pathname}?${queryParams.toString()}`;
    history.pushState(null, '', newURL);
}


// Render products on the page
function renderProducts(products) {
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = ''; // Clear current items

    const fragment = document.createDocumentFragment();
    products.forEach(product => {
        const productElement = createProductElement(product);
        fragment.appendChild(productElement);
    });
    itemsContainer.appendChild(fragment); // Append all at once

    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;
}

// Create product card
function createProductElement(product) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card_img">
            <a href="/product/${product._id}">
                <img src="${product.productMainImage}" alt="${product.productName}" class="card-img-top">
            </a>
        </div>
        <div class="card_content">
            <div class="card_price">
                <div class="card_price_fake">
                    <div class="card_price_value">${product.productPrice}</div>
                </div>
            </div>
            <div class="card_detail">
                <div class="card_title">
                    <a href="/product/${product._id}">
                        <h5 class="card-title">${product.productName}</h5>
                    </a>
                </div>
                <div class="card_description">
                    <p>${product.productDescription}</p>
                </div>
            </div>
        </div>`;
    return card;
}



function handleSearch() {
  const query = document.querySelector("#search__bar__product").value;

  if (!query) {
    notify({
      type: "warning",
      msg: "Please enter a search query",
    });
    return;
  }

  showSpinner();
    fetch(`http://localhost:5000/api/product/search`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      keysearch: query,
      page: currentPage,
      limit: limit
    })
  })
    .then((res) => res.json())
    .then((data) => {
      hideSpinner();
      if (data.item.length === 0) {
        notify({
          type: "warning",
          msg: "No results found",
        });
        // Reset pagination when no results found
        document.getElementById('page-info').textContent = `Page 0 of 0`;
        document.getElementById('prev-btn').disabled = true;
        document.getElementById('next-btn').disabled = true;
        const itemsContainer = document.getElementById('items-container');
        itemsContainer.innerHTML = ''; // Clear current items
      } else {
        // Update total pages from search results
        totalPages = data.totalPages;
        // Cache the search results
        cache.clear(); // Clear existing cache
        cache.set(currentPage, data.item);
        // Render the search results
        renderProducts(data.item);
        // Prefetch next page of search results
        prefetchPage(currentPage + 1);
        // Update the URL
        const payload = {
            keysearch: query,
            page: currentPage,
            limit: limit
        };
        
        updateURL(payload);
      }
    })
    .catch((error) => {
      hideSpinner();
      notify({
        type: "error",
        msg: error.message,
      });
    });
}



// Add event listener for search input
document.querySelector("#search__bar__product").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        currentPage = 1; // Reset to first page when searching
        cache.clear(); // Clear the cache for new search
        handleSearch();
    }
});

function loadSearchProducts(productList) {
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = ''; // Clear current items

    const fragment = document.createDocumentFragment();
    productList.forEach(product => {
        const productElement = createProductElement(product);
        fragment.appendChild(productElement);
    });
    itemsContainer.appendChild(fragment); // Append all at once

    document.getElementById('page-info').textContent = `Page 1 of 1`;
    document.getElementById('prev-btn').disabled = true;
    document.getElementById('next-btn').disabled = true;
    
    
}
// Event listeners for pagination buttons
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage-=1;
        loadProducts();
        prefetchPage(currentPage - 1); // Prefetch previous page
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadProducts();
        prefetchPage(currentPage + 1); // Prefetch next page
    }
});

function filterProducts() {
    // Get filter values from the UI
    // const searchValue = document.getElementById('search__bar__product').value.trim();
    currentPage = 1;
    const selectedBrands = Array.from(
        document.querySelectorAll('#brand-filter input[type="checkbox"]:checked')
    ).map(input => input.id.replace('checkbox_', ''));

    const selectedCategories = Array.from(
        document.querySelectorAll('#category-filter input[type="checkbox"]:checked')
    ).map(input => input.id.replace('checkbox_', ''));

    // const selectedPrice = document.getElementById('price-filter').value;

    const selectedSort = document.querySelector('#sort-filter input[type="radio"]:checked')?.id || '';

    const filterPayload = {
        // search: searchValue,
        page: currentPage,
        limit: limit,
        brands: selectedBrands, // Array
        categories: selectedCategories, // Array
        // price: selectedPrice, // Số hoặc chuỗi nếu backend cần
        sortType: selectedSort.includes('asc') ? 'asc' : 'desc', // Phân tích từ id
        sortBy: 'productPrice', // Hoặc một trường cụ thể

    };

    updateURL(filterPayload); // Update the URL with filter parameters


    // console.log(filterPayload);
    showSpinner();
    // Fetch filtered products
    fetch('http://localhost:5000/api/product/filter', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterPayload)
    })
        .then(response => response.json())
        .then(data => {
            hideSpinner();
            const { totalPages: total, item } = data;
            totalPages = total; // Update total pages
            cache.clear(); // Clear the cache as filters have changed
            cache.set(currentPage, item); // Cache the new filtered results
            renderProducts(item); // Render filtered products
            prefetchPage(currentPage + 1); // Prefetch next page for filtered results
        })
        .catch(error => console.error('Error filtering products:', error));
}

function showSpinner() {
    document.getElementById('loading-spinner').classList.remove('hidden');
}

function hideSpinner() {
    document.getElementById('loading-spinner').classList.add('hidden');
}

function showBrand() {
    const brandFilterArea = document.getElementById('brand-filter');
    console.log("hehe");
    var brands = [];
    const selectedBrands = Array.from(
        document.querySelectorAll('#brand-filter input[type="checkbox"]:checked')
    ).map(input => input.id.replace('checkbox_', ''));
    
    fetch('http://localhost:5000/api/brand', {
        credentials: 'include',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            brands = data.data;
            for (const brand of brands) {
                const brandElement = document.createElement('div');
                brandElement.innerHTML = `
                    <div class="custom-checkbox-group">
                        <input 
                            type="checkbox" 
                            id="checkbox_${brand._id}" 
                            class="custom-checkbox" 
                            ${selectedBrands.includes(brand) ? 'checked' : ''}>
                        <label class="custom-label" for="checkbox_${brand._id}">${brand.brandName}</label>
                    </div>
                `;


                brandFilterArea.appendChild(brandElement);
            }
        })
        .catch(error => console.error('Error loading brands:', error));
}

function showCategory() {
    const categoryFilterArea = document.getElementById('category-filter');
    var categories = [];
    const selectedCategories = Array.from(
        document.querySelectorAll('#category-filter input[type="checkbox"]:checked')
    ).map(input => input.id.replace('checkbox_', ''));
    
    fetch('http://localhost:5000/api/category', {
        credentials: 'include',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            categories = data.data;
            for (const category of categories) {
                const categoryElement = document.createElement('div');
                 categoryElement.innerHTML = `
                    <div class="custom-checkbox-group">
                        <input 
                            type="checkbox" 
                            id="checkbox_${category._id}" 
                            class="custom-checkbox" 
                            ${selectedCategories.includes(category) ? 'checked' : ''}>
                        <label class="custom-label" for="checkbox_${category._id}">${category.categoryName}</label>
                    </div>
                `;

                categoryFilterArea.appendChild(categoryElement);
            }
        })
        .catch(error => console.error('Error loading models:', error));
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        page: parseInt(params.get('page') || '1'),
        limit: parseInt(params.get('limit') || '10', 10),
        keysearch: params.get('keysearch') || '',
        brands: params.get('brands') ? params.get('brands').split(',') : [],
        categories: params.get('categories') ? params.get('categories').split(',') : [],
        sortType: params.get('sortType') || '',
        sortBy: params.get('sortBy') || ''
    };
}


document.addEventListener('DOMContentLoaded', () => {
    const queryParams = getQueryParams();

    // Cập nhật các giá trị từ URL vào các filter UI
    if (queryParams.keysearch) {
        document.querySelector('#search__bar__product').value = queryParams.keysearch;
    }

    queryParams.brands.forEach(brand => {
        const checkbox = document.getElementById(`checkbox_${brand}`);
        if (checkbox) checkbox.checked = true;
    });

    queryParams.categories.forEach(category => {
        const checkbox = document.getElementById(`checkbox_${category}`);
        if (checkbox) checkbox.checked = true;
    });

    if (queryParams.sortType) {
        const radio = document.getElementById(queryParams.sortType === 'asc' ? 'sort_price_asc' : 'sort_price_desc');
        if (radio) radio.checked = true;
    }

    // Set current page and limit
    currentPage = queryParams.page;
    limit = queryParams.limit;

    // Load products with initial filters
    loadProducts();
    loadSideBar();
});


// function loadSideBar() {
//     showBrand();
//     showCategory();
// }

