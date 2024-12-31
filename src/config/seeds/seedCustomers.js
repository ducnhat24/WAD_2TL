const Customer = require("../../components/customer/schema/Customer"); // Update with the correct path to your model
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

const seedCustomers = async () => {
    const password = await hashPassword('1');
    const customers = [
        {
            customerAvatar: "https://example.com/avatar1.jpg",
            customerName: "John Doe",
            customerEmail: "johndoe@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar2.jpg",
            customerName: "Jane Smith",
            customerEmail: "janesmith@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar3.jpg",
            customerName: "Alice Johnson",
            customerEmail: "alicejohnson@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar4.jpg",
            customerName: "Bob Brown",
            customerEmail: "bobbrown@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar5.jpg",
            customerName: "Charlie White",
            customerEmail: "charliewhite@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar6.jpg",
            customerName: "Daisy Green",
            customerEmail: "daisygreen@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar7.jpg",
            customerName: "Ethan Blue",
            customerEmail: "ethanblue@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar8.jpg",
            customerName: "Fiona Red",
            customerEmail: "fionared@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar9.jpg",
            customerName: "George Yellow",
            customerEmail: "georgeyellow@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar10.jpg",
            customerName: "Hannah Purple",
            customerEmail: "hannahpurple@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar11.jpg",
            customerName: "Ian Grey",
            customerEmail: "iangrey@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar12.jpg",
            customerName: "Julia Pink",
            customerEmail: "juliapink@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar13.jpg",
            customerName: "Kevin Black",
            customerEmail: "kevinblack@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar14.jpg",
            customerName: "Laura Cyan",
            customerEmail: "lauracyan@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar15.jpg",
            customerName: "Mike Teal",
            customerEmail: "miketeal@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar16.jpg",
            customerName: "Nina Indigo",
            customerEmail: "ninaindigo@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar17.jpg",
            customerName: "Oscar Violet",
            customerEmail: "oscarviolet@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar18.jpg",
            customerName: "Paula Magenta",
            customerEmail: "paulamagenta@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar19.jpg",
            customerName: "Quincy Gold",
            customerEmail: "quincygold@example.com",
            customerPassword: password, // Use a hashed password

        },
        {
            customerAvatar: "https://example.com/avatar20.jpg",
            customerName: "Rachel Silver",
            customerEmail: "rachelsilver@example.com",
            customerPassword: password, // Use a hashed password

        },
    ];
    try {
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')
        console.log('\x1b[0;31mSeeding customer data.....................\x1b[0;0m')
        // Insert customers into the database
        await Customer.deleteMany({});
        await Customer.insertMany(customers);

        console.log('\x1b[0;32mSeed customer data has been added to the database.\x1b[0;0m');
        console.log('\x1b[0;36m-----------------------------------------------------------------\x1b[0;0m')

    } catch (error) {
        console.error('Error seeding user data:', error);
        throw error;
    }
};

module.exports = {
    seedCustomers
};
