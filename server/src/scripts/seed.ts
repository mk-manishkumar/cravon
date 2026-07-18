import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import Role from '../models/Role.js';
import Permission from '../models/Permission.js';
import RolePermission from '../models/RolePermission.js';
import User from '../models/User.js';
import UserRole from '../models/UserRole.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cravon';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected.\n');

    // Clear existing RBAC data to prevent duplicates on rerun
    console.log('Clearing existing RBAC data...');
    await RolePermission.deleteMany({});
    await UserRole.deleteMany({});
    await Permission.deleteMany({});
    await Role.deleteMany({});
    await User.deleteMany({ email: 'superadmin@cravon.com' });
    
    // Insert Permissions
    console.log('Seeding Permissions...');
    const permissions = await Permission.insertMany([
      { permissionName: 'create_restaurant', description: 'Can create a new restaurant', module: 'Restaurant' },
      { permissionName: 'delete_restaurant', description: 'Can delete a restaurant', module: 'Restaurant' },
      { permissionName: 'verify_restaurant', description: 'Can verify and approve a restaurant', module: 'Restaurant' },
      { permissionName: 'manage_users', description: 'Can manage all users in the system', module: 'User' },
      { permissionName: 'assign_roles', description: 'Can assign roles to users', module: 'RBAC' },
      { permissionName: 'view_reports', description: 'Can view system financial reports', module: 'Reports' },
    ]);

    // Insert Roles
    console.log('Seeding Roles...');
    const superAdminRole = await Role.create({ roleName: 'SuperAdmin', description: 'Root user with all permissions' });
    const adminRole = await Role.create({ roleName: 'Admin', description: 'System administrator' });
    const restaurantOwnerRole = await Role.create({ roleName: 'RestaurantOwner', description: 'Owner of a restaurant' });
    const customerRole = await Role.create({ roleName: 'Customer', description: 'Standard app user' });

    // Connect Permissions to SuperAdmin (Give SuperAdmin EVERYTHING)
    console.log('Assigning Permissions to Roles...');
    const superAdminPermissions = permissions.map(p => ({
      roleId: superAdminRole._id,
      permissionId: p._id
    }));
    await RolePermission.insertMany(superAdminPermissions);

    // Give Admin limited permissions (example)
    const adminPerms = permissions.filter(p => ['verify_restaurant', 'manage_users'].includes(p.permissionName));
    const adminPermissions = adminPerms.map(p => ({
      roleId: adminRole._id,
      permissionId: p._id
    }));
    await RolePermission.insertMany(adminPermissions);

    // Create SuperAdmin User
    console.log('Creating SuperAdmin User...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('SuperSecret123!', salt);

    const superAdminUser = await User.create({
      name: 'Super Admin',
      email: 'superadmin@cravon.com',
      password: hashedPassword,
      phone: '1234567890',
      status: 'active'
    });

    // Assign SuperAdmin Role to the SuperAdmin User
    console.log('Assigning SuperAdmin role to user...');
    await UserRole.create({
      userId: superAdminUser._id,
      roleId: superAdminRole._id
    });

    console.log('\n Database Seeded Successfully!');
    console.log('---------------------------------');
    console.log(`SuperAdmin Email: superadmin@cravon.com`);
    console.log(`SuperAdmin Password: SuperSecret123!`);
    console.log('---------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
