const bcrypt = require('bcryptjs');
const sequelize = require('../db');
const {
  User,
  UserAddress,
  Product,
  ProductMedia,
  Order,
  OrderItem,
  Payment,
  Shipment,
  Category,
  Brand
} = require('../models');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    logger.info('Starting data seeding...');

    // 1. Create Categories
    logger.info('Seeding categories...');
    const categories = await Category.bulkCreate([
      { name: 'Laptop', slug: 'laptop' },
      { name: 'Smartphone', slug: 'smartphone' },
      { name: 'Audio', slug: 'audio' },
      { name: 'Peripheral', slug: 'peripheral' },
      { name: 'Wearable', slug: 'wearable' }
    ]);

    // 2. Create Brands
    logger.info('Seeding brands...');
    const brands = await Brand.bulkCreate([
      { name: 'Asus', slug: 'asus' },
      { name: 'Samsung', slug: 'samsung' },
      { name: 'Sony', slug: 'sony' },
      { name: 'Keychron', slug: 'keychron' },
      { name: 'Apple', slug: 'apple' }
    ]);

    // 3. Create Users (including ADMIN)
    logger.info('Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    
    const users = await User.bulkCreate([
      // ADMIN ACCOUNT
      {
        nickname: 'admin',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        full_name: 'Administrator',
        phone: '081234567899'
      },
      // REGULAR USERS
      {
        nickname: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
        full_name: 'John Doe',
        phone: '081234567890',
        birthday: '1990-01-15'
      },
      {
        nickname: 'janesmith',
        email: 'jane@example.com',
        password: hashedPassword,
        full_name: 'Jane Smith',
        phone: '081234567891',
        birthday: '1992-05-20'
      },
      {
        nickname: 'bobwilson',
        email: 'bob@example.com',
        password: hashedPassword,
        full_name: 'Bob Wilson',
        phone: '081234567892',
        birthday: '1988-08-10'
      }
    ]);

    // 4. Create User Addresses (skip admin)
    logger.info('Seeding user addresses...');
    await UserAddress.bulkCreate([
      {
        user_id: users[1].id, // johndoe
        label: 'Home',
        recipient_name: 'John Doe',
        phone: '081234567890',
        address_line: 'Jl. Sudirman No. 123',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postal_code: '12190',
        is_default: true
      },
      {
        user_id: users[2].id, // janesmith
        label: 'Office',
        recipient_name: 'Jane Smith',
        phone: '081234567891',
        address_line: 'Jl. Thamrin No. 456',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        postal_code: '10230',
        is_default: true
      },
      {
        user_id: users[3].id, // bobwilson
        label: 'Home',
        recipient_name: 'Bob Wilson',
        phone: '081234567892',
        address_line: 'Jl. Gatot Subroto No. 789',
        city: 'Bandung',
        province: 'Jawa Barat',
        postal_code: '40123',
        is_default: true
      }
    ]);

    // 5. Create Products 
    logger.info('Seeding products...');
    const products = await Product.bulkCreate([
      {
        name: 'Laptop Asus VivoBook 14 A1400',
        description: 'Laptop ringan dengan prosesor AMD Ryzen 5, RAM 8GB, dan SSD 512GB.',
        brand_id: brands[0].id,
        category_id: categories[0].id,
        price: 8499000,
        stock: 12,
        rating: 4.7
      },
      {
        name: 'Smartphone Samsung Galaxy A55 5G',
        description: 'Smartphone mid-range dengan layar Super AMOLED 6.6 inci, baterai 5000mAh.',
        brand_id: brands[1].id,
        category_id: categories[1].id,
        price: 5999000,
        stock: 20,
        rating: 4.8
      },
      {
        name: 'Headphone Sony WH-1000XM5',
        description: 'Headphone wireless dengan noise cancelling terbaik di kelasnya.',
        brand_id: brands[2].id,
        category_id: categories[2].id,
        price: 4999000,
        stock: 15,
        rating: 4.9
      },
      {
        name: 'Mechanical Keyboard Keychron K6 RGB',
        description: 'Keyboard mechanical 65% layout dengan switch Gateron Brown.',
        brand_id: brands[3].id,
        category_id: categories[3].id,
        price: 1350000,
        stock: 25,
        rating: 4.6
      },
      {
        name: 'Smartwatch Apple Watch SE 2nd Gen',
        description: 'Smartwatch dengan fitur pelacak kebugaran dan sensor detak jantung.',
        brand_id: brands[4].id,
        category_id: categories[4].id,
        price: 5499000,
        stock: 18,
        rating: 4.8
      }
    ]);

    // 6. Create Product Media
    logger.info('Seeding product media...');
    await ProductMedia.bulkCreate([
      { product_id: products[0].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1587202372775-98927d7dbd06?w=800' },
      { product_id: products[1].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800' },
      { product_id: products[2].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=800' },
      { product_id: products[3].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1607083205972-7eec3b7b8a7b?w=800' },
      { product_id: products[4].id, media_type: 'image', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' }
    ]);

    // 7. Create Orders dengan berbagai status (for regular users, NOT admin)
    logger.info('Seeding orders...');
    const orders = await Order.bulkCreate([
      {
        user_id: users[1].id, // johndoe
        status: 'PENDING',
        total_amount: 1350000,
        shipping_cost: 20000,
        payment_method: 'bank_transfer'
      },
      {
        user_id: users[1].id, // johndoe
        status: 'PAID',
        total_amount: 8499000,
        shipping_cost: 20000,
        payment_method: 'bank_transfer'
      },
      {
        user_id: users[2].id, // janesmith
        status: 'SHIPPED',
        total_amount: 5999000,
        shipping_cost: 20000,
        payment_method: 'credit_card'
      },
      {
        user_id: users[3].id, // bobwilson
        status: 'DELIVERED',
        total_amount: 4999000,
        shipping_cost: 20000,
        payment_method: 'e_wallet'
      },
      {
        user_id: users[2].id, // janesmith
        status: 'COMPLETED',
        total_amount: 5499000,
        shipping_cost: 20000,
        payment_method: 'bank_transfer'
      },
      {
        user_id: users[3].id, // bobwilson
        status: 'CANCELED',
        total_amount: 1350000,
        shipping_cost: 20000,
        payment_method: 'bank_transfer'
      }
    ]);

    // 8. Create Order Items
    logger.info('Seeding order items...');
    await OrderItem.bulkCreate([
      // Order 1 - PENDING
      {
        order_id: orders[0].id,
        product_id: products[3].id,
        product_name_snapshot: products[3].name,
        price_snapshot: products[3].price,
        quantity: 1
      },
      // Order 2 - PAID
      {
        order_id: orders[1].id,
        product_id: products[0].id,
        product_name_snapshot: products[0].name,
        price_snapshot: products[0].price,
        quantity: 1
      },
      // Order 3 - SHIPPED
      {
        order_id: orders[2].id,
        product_id: products[1].id,
        product_name_snapshot: products[1].name,
        price_snapshot: products[1].price,
        quantity: 1
      },
      // Order 4 - DELIVERED
      {
        order_id: orders[3].id,
        product_id: products[2].id,
        product_name_snapshot: products[2].name,
        price_snapshot: products[2].price,
        quantity: 1
      },
      // Order 5 - COMPLETED
      {
        order_id: orders[4].id,
        product_id: products[4].id,
        product_name_snapshot: products[4].name,
        price_snapshot: products[4].price,
        quantity: 1
      },
      // Order 6 - CANCELED
      {
        order_id: orders[5].id,
        product_id: products[3].id,
        product_name_snapshot: products[3].name,
        price_snapshot: products[3].price,
        quantity: 1
      }
    ]);

    // 9. Create Payments
    logger.info('Seeding payments...');
    await Payment.bulkCreate([
      {
        order_id: orders[1].id,
        provider: 'bank_transfer',
        status: 'PAID',
        transaction_id: 'TRX-20241126-0001',
        amount: 8519000,
        paid_at: new Date('2024-11-20')
      },
      {
        order_id: orders[2].id,
        provider: 'credit_card',
        status: 'PAID',
        transaction_id: 'TRX-20241126-0002',
        amount: 6019000,
        paid_at: new Date('2024-11-21')
      },
      {
        order_id: orders[3].id,
        provider: 'e_wallet',
        status: 'PAID',
        transaction_id: 'TRX-20241126-0003',
        amount: 5019000,
        paid_at: new Date('2024-11-22')
      },
      {
        order_id: orders[4].id,
        provider: 'bank_transfer',
        status: 'PAID',
        transaction_id: 'TRX-20241126-0004',
        amount: 5519000,
        paid_at: new Date('2024-11-23')
      }
    ]);

    // 10. Create Shipments
    logger.info('Seeding shipments...');
    await Shipment.bulkCreate([
      {
        order_id: orders[2].id,
        courier: 'JNE',
        tracking_number: 'JNE-20241126-0001',
        status: 'IN_TRANSIT',
        shipped_at: new Date('2024-11-22')
      },
      {
        order_id: orders[3].id,
        courier: 'SiCepat',
        tracking_number: 'SICEPAT-20241126-0002',
        status: 'DELIVERED',
        shipped_at: new Date('2024-11-23'),
        delivered_at: new Date('2024-11-24')
      },
      {
        order_id: orders[4].id,
        courier: 'J&T',
        tracking_number: 'JNT-20241126-0003',
        status: 'DELIVERED',
        shipped_at: new Date('2024-11-24'),
        delivered_at: new Date('2024-11-25')
      }
    ]);

    logger.info('✅ All data seeded successfully!');
    logger.info('');
    logger.info('=== ADMIN CREDENTIALS ===');
    logger.info('Email: admin@example.com');
    logger.info('Password: admin123');
    logger.info('Role: Can view ALL orders');
    logger.info('');
    logger.info('=== USER CREDENTIALS ===');
    logger.info('Email: john@example.com');
    logger.info('Password: password123');
    logger.info('');
    logger.info('Order Status Examples:');
    logger.info('- Order #1: PENDING (johndoe)');
    logger.info('- Order #2: PAID (johndoe)');
    logger.info('- Order #3: SHIPPED (janesmith)');
    logger.info('- Order #4: DELIVERED (bobwilson)');
    logger.info('- Order #5: COMPLETED (janesmith)');
    logger.info('- Order #6: CANCELED (bobwilson)');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();