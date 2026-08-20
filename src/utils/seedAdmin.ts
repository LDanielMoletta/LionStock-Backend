import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

import bcrypt from 'bcrypt';
import connectDatabase from '../config/database';
import User from '../models/user.model';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function seedAdmin(): Promise<void> {
  await connectDatabase();

  const email = ADMIN_EMAIL.toLowerCase();
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = ADMIN_NAME;
    existing.password = hashed;
    existing.role = 'admin';
    existing.active = true;
    await existing.save();
    console.log('Admin atualizado:', email);
  } else {
    const user = new User({
      name: ADMIN_NAME,
      email,
      password: hashed,
      role: 'admin',
      active: true,
    });
    await user.save();
    console.log('Admin criado:', email);
  }

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Falha ao criar/atualizar admin:', err.message || err);
  process.exit(1);
});