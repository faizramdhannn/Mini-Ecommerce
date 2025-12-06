const { User, UserAddress, Order } = require('../models');

class UserService {
  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: UserAddress,
          as: 'addresses'
        }
      ]
    });
    
    return user;
  }

  /**
   * Get all users dengan pagination
   */
  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return {
      users: rows,
      total: count,
      page,
      limit
    };
  }

  /**
   * Update user profile
   */
  async updateUser(userId, data) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.update(data);
    
    return await this.getUserById(userId);
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.destroy();
    
    return true;
  }

  /**
   * Get user addresses
   */
  async getUserAddresses(userId) {
    const addresses = await UserAddress.findAll({
      where: { user_id: userId }
    });
    
    return addresses;
  }

  /**
   * Add user address
   */
  async addUserAddress(userId, addressData) {
    const address = await UserAddress.create({
      user_id: userId,
      ...addressData
    });
    
    return address;
  }

  /**
   * Update user address
   */
  async updateUserAddress(addressId, userId, addressData) {
    const address = await UserAddress.findOne({
      where: { id: addressId, user_id: userId }
    });
    
    if (!address) {
      throw new Error('Address not found');
    }
    
    await address.update(addressData);
    
    return address;
  }

  /**
   * Delete user address
   */
  async deleteUserAddress(addressId, userId) {
    const address = await UserAddress.findOne({
      where: { id: addressId, user_id: userId }
    });
    
    if (!address) {
      throw new Error('Address not found');
    }
    
    await address.destroy();
    
    return true;
  }
}

module.exports = new UserService();