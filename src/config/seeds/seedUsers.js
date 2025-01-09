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
            userRole: 'Admin',
            userPassword: password,
        },
        {
            userName: 'Tran Thi B',
            userPhone: '0987654321',
            userDateOfBirth: '22/09/1992',
            userEmail: 'tranthib@gmail.com',
            userAddress: 'Hanoi',
            userRole: 'Manager',
            userPassword: password,
        },
        {
            userName: 'Pham Van C',
            userPhone: '0911223344',
            userDateOfBirth: '05/11/1988',
            userEmail: 'phamvanc@gmail.com',
            userAddress: 'Ho Chi Minh City',
            userRole: 'Manager',
            userPassword: password,
        },
        {
            userName: 'Le Thi D',
            userPhone: '0933445566',
            userDateOfBirth: '18/02/1995',
            userEmail: 'lethid@gmail.com',
            userAddress: 'Da Nang',
            userRole: 'Manager',
            userPassword: password,
        },
        {
            userName: 'Nguyen Van E',
            userPhone: '0977112233',
            userDateOfBirth: '14/07/1990',
            userEmail: 'nguyenvane@gmail.com',
            userAddress: 'Hanoi',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Tran Thi F',
            userPhone: '0901234567',
            userDateOfBirth: '25/12/1993',
            userEmail: 'tranthif@gmail.com',
            userAddress: 'Ho Chi Minh City',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Pham Van G',
            userPhone: '0933221100',
            userDateOfBirth: '10/03/1991',
            userEmail: 'phamvang@gmail.com',
            userAddress: 'Da Nang',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Le Thi H',
            userPhone: '0944556677',
            userDateOfBirth: '01/06/1994',
            userEmail: 'lethih@gmail.com',
            userAddress: 'Hai Phong',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Nguyen Van I',
            userPhone: '0912887766',
            userDateOfBirth: '07/05/1992',
            userEmail: 'nguyenvani@gmail.com',
            userAddress: 'Can Tho',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Tran Thi J',
            userPhone: '0922334455',
            userDateOfBirth: '09/09/1996',
            userEmail: 'tranthij@gmail.com',
            userAddress: 'Hanoi',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Pham Van K',
            userPhone: '0944992233',
            userDateOfBirth: '12/08/1991',
            userEmail: 'phamvank@gmail.com',
            userAddress: 'Ho Chi Minh City',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Le Thi L',
            userPhone: '0912334455',
            userDateOfBirth: '30/11/1993',
            userEmail: 'lethil@gmail.com',
            userAddress: 'Da Nang',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Nguyen Van M',
            userPhone: '0903445566',
            userDateOfBirth: '17/04/1989',
            userEmail: 'nguyenvanm@gmail.com',
            userAddress: 'Hanoi',
            userRole: 'Shipper',
            userPassword: password,
        },
        {
            userName: 'Tran Thi N',
            userPhone: '0934112233',
            userDateOfBirth: '08/10/1992',
            userEmail: 'tranthin@gmail.com',
            userAddress: 'Ho Chi Minh City',
            userRole: 'Shipper',
            userPassword: password,
        }
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