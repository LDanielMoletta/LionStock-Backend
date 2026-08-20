import Category, { ICategory } from '../models/category.model';

interface CreateCategoryInput {
  name: string;
  description?: string;
  active?: boolean;
}

interface UpdateCategoryInput {
  name?: string;
  description?: string;
  active?: boolean;
}

class CategoryService {
  async createCategory(data: CreateCategoryInput): Promise<ICategory> {
    const name = data.name ? data.name.trim() : '';
    if (!name) {
      throw { statusCode: 400, message: 'Nome da categoria é obrigatório.' };
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      throw { statusCode: 409, message: 'Categoria já cadastrada.' };
    }

    const category = new Category({
      name,
      description: data.description || '',
      active: typeof data.active === 'boolean' ? data.active : true,
    });

    await category.save();
    return category;
  }

  async findAll(): Promise<ICategory[]> {
    return Category.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ICategory> {
    const category = await Category.findById(id);
    if (!category) {
      throw { statusCode: 404, message: 'Categoria não encontrada.' };
    }
    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<ICategory> {
    const category = await Category.findById(id);
    if (!category) {
      throw { statusCode: 404, message: 'Categoria não encontrada.' };
    }

    if (data.name) {
      const name = data.name.trim();
      const existing = await Category.findOne({ name, _id: { $ne: id } });
      if (existing) {
        throw { statusCode: 409, message: 'Categoria já cadastrada.' };
      }
      category.name = name;
    }

    if (typeof data.description === 'string') {
      category.description = data.description;
    }

    if (typeof data.active === 'boolean') {
      category.active = data.active;
    }

    await category.save();
    return category;
  }

  async deleteCategory(id: string): Promise<ICategory> {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw { statusCode: 404, message: 'Categoria não encontrada.' };
    }
    return category;
  }
}

export default new CategoryService();