require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://en22cs301664_db_user:nita1234@cluster0.lyao36s.mongodb.net/insta?retryWrites=true&w=majority';

async function initDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Check if database exists by trying to list collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Current collections in "insta" database:');
    if (collections.length === 0) {
      console.log('   No collections found. Database will appear after first document is created.');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    // Create a test user to initialize the database (optional)
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (!existingUser) {
      console.log('\n🔄 Creating a test user to initialize the database...');
      const testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test1234'
      });
      await testUser.save();
      console.log('✅ Test user created successfully!');
      console.log('   Username: testuser');
      console.log('   Email: test@example.com');
      console.log('   Password: test1234');
    } else {
      console.log('\n✅ Database already initialized with collections.');
    }

    console.log('\n✨ The "insta" database should now be visible in MongoDB Compass!');
    console.log('   Refresh your MongoDB Compass view to see it.');
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initDatabase();
