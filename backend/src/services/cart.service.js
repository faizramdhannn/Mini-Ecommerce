const { Cart, CartItem, Product, ProductMedia } = require('../models');

class CartService {
  /**
   * Get atau create cart untuk user
   */
  async getOrCreateCart(userId) {
    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [{ model: ProductMedia, as: 'media' }]
            }
          ]
        }
      ]
    });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
      cart.items = [];
    }

    return cart;
  }

  /**
   * Add item to cart
   */
  async addItem(userId, productId, quantity = 1) {
    const cart = await this.getOrCreateCart(userId);
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    // Cek apakah item sudah ada di cart
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId }
    });

    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new Error('Insufficient stock');
      }
      
      await cartItem.update({ quantity: newQuantity });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity
      });
    }

    return await this.getOrCreateCart(userId);
  }

  /**
   * Update item quantity
   */
  async updateItem(userId, cartItemId, quantity) {
    const cart = await this.getOrCreateCart(userId);
    
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, cart_id: cart.id },
      include: [{ model: Product, as: 'product' }]
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    if (cartItem.product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    await cartItem.update({ quantity });

    return await this.getOrCreateCart(userId);
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId, cartItemId) {
    const cart = await this.getOrCreateCart(userId);
    
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, cart_id: cart.id }
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await cartItem.destroy();

    return await this.getOrCreateCart(userId);
  }

  /**
   * Clear cart
   */
  async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    
    await CartItem.destroy({
      where: { cart_id: cart.id }
    });

    return await this.getOrCreateCart(userId);
  }
}

module.exports = new CartService();