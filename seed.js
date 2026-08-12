require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function seed() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Cloud successfully.");
    
    const email = "admin@prerit.dev";
    const password = "admin123";
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create or update admin
    await Admin.deleteMany({}); // clear existing admins just in case
    await Admin.create({ email, password: hashedPassword, name: "Bal Krishna" });
    
    console.log(`\n✅ Database successfully seeded!`);
    console.log(`-----------------------------------`);
    console.log(`Admin Login Email: ${email}`);
    console.log(`Admin Login Password: ${password}`);
    console.log(`-----------------------------------\n`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
