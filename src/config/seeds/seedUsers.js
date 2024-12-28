const User = require('../../components/admin/schema/User');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        const saltRounds = 1; // Độ mạnh của thuật toán (tốn tài nguyên hơn khi tăng số này)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw err;
    }
}

async function seedUsers() {
    const password = await hashPassword('1');
    const users = [
        {
            userName: 'Nguyen Van A',
            userPhone: '0912345678',
            userDateOfBirth: '15/06/1990',
            userEmail: 'nguyenvana@gmail.com',
            userAddress: 'Hanoi',
            userRole: 'admin',
            userPassword: password,
        },
        {
            userName: 'Tran Thi B',
            userPhone: '0938765432',
            userDateOfBirth: '22/11/1985',
            userEmail: 'tranthib@gmail.com',
            userAddress: 'Da Nang',
            userRole: 'staff',
            userPassword: password,
        },
        {
            userName: 'Le Hoang C',
            userPhone: '0987654321',
            userDateOfBirth: '05/03/1995',
            userEmail: 'lehoangc@gmail.com',
            userAddress: 'Ho Chi Minh City',
            userRole: 'staff',
            userPassword: password,
        },
        {
            userName: 'Pham Van D',
            userPhone: '0976543210',
            userDateOfBirth: '09/09/1992',
            userEmail: 'phamvand@gmail.com',
            userAddress: 'Can Tho',
            userRole: 'staff',
            userPassword: password,
        },
        {
            userName: 'Do Thi E',
            userPhone: '0943216789',
            userDateOfBirth: '01/01/2000',
            userEmail: 'dothie@gmail.com',
            userAddress: 'Hai Phong',
            userRole: 'staff',
            userPassword: password,
        },

    ];

    try {

        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
        console.log('\x1b[0;31mSeeding user data.....................\x1b[0;0m')
        await User.deleteMany({});


        await User.insertMany(users);
        console.log('\x1b[0;32mSeed user data has been added to the database.\x1b[0;0m');
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
    } catch (error) {
        console.error('Error seeding user data:', error);
        throw error;
    }
}

module.exports = {
    seedUsers
};