import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import Role from '../models/role.model.js';
import Permission from '../models/permission.model.js';
import RolePermission from '../models/rolePermission.model.js';
import User from '../models/user.model.js';
import UserRole from '../models/userRole.model.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cravon';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected.\n');

    // Seeding Permissions using bulkWrite for upsert
    console.log('Seeding Permissions...');
    const permissionData = [
      { permissionName: 'create_restaurant', description: 'Can create a new restaurant', module: 'Restaurant' },
      { permissionName: 'delete_restaurant', description: 'Can delete a restaurant', module: 'Restaurant' },
      { permissionName: 'verify_restaurant', description: 'Can verify and approve a restaurant', module: 'Restaurant' },
      { permissionName: 'manage_users', description: 'Can manage all users in the system', module: 'User' },
      { permissionName: 'assign_roles', description: 'Can assign roles to users', module: 'RBAC' },
      { permissionName: 'view_reports', description: 'Can view system financial reports', module: 'Reports' },
    ];
    
    await Permission.bulkWrite(permissionData.map(p => ({
      updateOne: { filter: { permissionName: p.permissionName }, update: { $set: p }, upsert: true }
    })));
    const permissions = await Permission.find();

    // Seeding Roles using bulkWrite for upsert
    console.log('Seeding Roles...');
    const roleData = [
      { roleName: 'SuperAdmin', description: 'Root user with all permissions' },
      { roleName: 'Admin', description: 'System administrator' },
      { roleName: 'RestaurantOwner', description: 'Owner of a restaurant' },
      { roleName: 'Customer', description: 'Standard app user' }
    ];

    await Role.bulkWrite(roleData.map(r => ({
      updateOne: { filter: { roleName: r.roleName }, update: { $set: r }, upsert: true }
    })));
    
    const superAdminRole = await Role.findOne({ roleName: 'SuperAdmin' });
    const adminRole = await Role.findOne({ roleName: 'Admin' });

    // Assigning Permissions to Roles
    console.log('Assigning Permissions to Roles...');
    // SuperAdmin gets everything
    for (const p of permissions) {
      await RolePermission.updateOne(
        { roleId: superAdminRole!._id, permissionId: p._id },
        { $set: { roleId: superAdminRole!._id, permissionId: p._id } },
        { upsert: true }
      );
    }

    // Admin gets limited permissions
    const adminPerms = permissions.filter(p => ['verify_restaurant', 'manage_users'].includes(p.permissionName));
    for (const p of adminPerms) {
      await RolePermission.updateOne(
        { roleId: adminRole!._id, permissionId: p._id },
        { $set: { roleId: adminRole!._id, permissionId: p._id } },
        { upsert: true }
      );
    }

    // Create SuperAdmin User
    console.log('Checking SuperAdmin User...');
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;
    if (!superAdminPassword) {
      console.error('\n ERROR: SUPERADMIN_PASSWORD is not defined in your environment variables.');
      console.error('Please add it to your .env file for security purposes.\n');
      process.exit(1);
    }
    let superAdminUser = await User.findOne({ email: 'superadmin@cravon.com' });
    
    if (!superAdminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

      superAdminUser = await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@cravon.com',
        password: hashedPassword,
        phone: '1234567890',
        status: 'active'
      });
      console.log('SuperAdmin User created successfully.');
    } else {
      console.log('SuperAdmin User already exists. Skipping creation.');
    }

    // Assign SuperAdmin Role to the SuperAdmin User
    console.log('Assigning SuperAdmin role to user...');
    await UserRole.updateOne(
      { userId: superAdminUser._id, roleId: superAdminRole!._id },
      { $set: { userId: superAdminUser._id, roleId: superAdminRole!._id } },
      { upsert: true }
    );

    console.log('\n Database Seeded Successfully!');
    console.log('---------------------------------');
    console.log(`SuperAdmin Email: superadmin@cravon.com`);
    console.log(`SuperAdmin Password: [Loaded from .env]`);
    console.log('---------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

await seedDatabase();
