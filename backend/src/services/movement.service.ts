import Movement, { IMovement, MovementType } from '../models/movement.model';
import Product, { IProduct } from '../models/product.model';
import User, { IUser } from '../models/user.model';

interface CreateMovementInput {
  product: string;
  user: string;
  type: MovementType;
  quantity: number;
  reason?: string;
}

class MovementService {
  async createMovement(data: CreateMovementInput): Promise<IMovement & { product: IProduct; user: Omit<IUser, 'password'> }> {
    const quantity = typeof data.quantity === 'number' ? data.quantity : Number(data.quantity);
    if (!data.product) throw { statusCode: 400, message: 'Produto é obrigatório.' };
    if (!data.user) throw { statusCode: 400, message: 'Usuário é obrigatório.' };
    if (!['ENTRY', 'EXIT'].includes(data.type)) throw { statusCode: 400, message: 'Tipo de movimentação inválido.' };
    if (!Number.isFinite(quantity) || quantity <= 0) throw { statusCode: 400, message: 'Quantidade deve ser maior que zero.' };

    const product = await Product.findById(data.product);
    if (!product) throw { statusCode: 404, message: 'Produto não encontrado.' };

    const user = await User.findById(data.user);
    if (!user) throw { statusCode: 404, message: 'Usuário não encontrado.' };

    if (data.type === 'EXIT' && product.quantity < quantity) {
      throw { statusCode: 400, message: 'Estoque insuficiente para esta saída.' };
    }

    const movement = new Movement({
      product: product._id,
      type: data.type,
      quantity,
      reason: data.reason || '',
      user: user._id,
    });

    await movement.save();

    if (data.type === 'ENTRY') {
      product.quantity += quantity;
    } else {
      product.quantity -= quantity;
    }

    await product.save();
    await movement.populate({ path: 'product' });
    await movement.populate({ path: 'user', select: '-password' });
    
    const result = movement.toObject() as IMovement & { product: IProduct; user: Omit<IUser, 'password'> };
    if (result.user) delete (result.user as { password?: string }).password;
    return result;
  }

  async findAll(): Promise<Array<IMovement & { product: IProduct; user: Omit<IUser, 'password'> }>> {
    const movements = await Movement.find()
      .populate({ path: 'product' })
      .populate({ path: 'user', select: '-password' })
      .sort({ createdAt: -1 });
    
    return movements.map((movement) => {
      const result = movement.toObject() as IMovement & { product: IProduct; user: Omit<IUser, 'password'> };
      if (result.user) delete (result.user as { password?: string }).password;
      return result;
    });
  }

  async findById(id: string): Promise<IMovement & { product: IProduct; user: Omit<IUser, 'password'> }> {
    const movement = await Movement.findById(id)
      .populate({ path: 'product' })
      .populate({ path: 'user', select: '-password' });
    
    if (!movement) throw { statusCode: 404, message: 'Movimentação não encontrada.' };
    const result = movement.toObject() as IMovement & { product: IProduct; user: Omit<IUser, 'password'> };
    if (result.user) delete (result.user as { password?: string }).password;
    return result;
  }
}

export default new MovementService();