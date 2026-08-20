import Supplier, { ISupplier } from '../models/supplier.model';

interface CreateSupplierInput {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

interface UpdateSupplierInput {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

class SupplierService {
  async createSupplier(data: CreateSupplierInput): Promise<ISupplier> {
    const name = data.name ? data.name.trim() : '';
    if (!name) {
      throw { statusCode: 400, message: 'Nome do fornecedor é obrigatório.' };
    }

    const supplier = new Supplier({
      name,
      contactName: data.contactName || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      active: typeof data.active === 'boolean' ? data.active : true,
    });

    await supplier.save();
    return supplier;
  }

  async findAll(): Promise<ISupplier[]> {
    return Supplier.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ISupplier> {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      throw { statusCode: 404, message: 'Fornecedor não encontrado.' };
    }
    return supplier;
  }

  async updateSupplier(id: string, data: UpdateSupplierInput): Promise<ISupplier> {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      throw { statusCode: 404, message: 'Fornecedor não encontrado.' };
    }

    if (data.name) {
      supplier.name = data.name.trim();
    }
    if (typeof data.contactName === 'string') supplier.contactName = data.contactName;
    if (typeof data.email === 'string') supplier.email = data.email;
    if (typeof data.phone === 'string') supplier.phone = data.phone;
    if (typeof data.address === 'string') supplier.address = data.address;
    if (typeof data.active === 'boolean') supplier.active = data.active;

    await supplier.save();
    return supplier;
  }

  async deleteSupplier(id: string): Promise<ISupplier> {
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) {
      throw { statusCode: 404, message: 'Fornecedor não encontrado.' };
    }
    return supplier;
  }
}

export default new SupplierService();