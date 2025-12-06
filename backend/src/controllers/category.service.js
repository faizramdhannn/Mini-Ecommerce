// services/category.service.js
const { slugify } = require('../utils/slugify');

class CategoryService {
  async createCategory(data) {
    // Auto-generate slug dari name
    if (!data.slug && data.name) {
      data.slug = slugify(data.name);
    }
    
    const category = await Category.create(data);
    return category;
  }

  async updateCategory(id, data) {
    // Auto-generate slug jika name berubah
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }
    
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');
    
    await category.update(data);
    return category;
  }
}