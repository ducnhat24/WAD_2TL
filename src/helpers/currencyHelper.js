const Handlebars = require('handlebars');

// Định nghĩa helper cho VND
Handlebars.registerHelper('formatCurrency', function (value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
});
