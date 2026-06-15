import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://localhost:27017/task-management';

  try {
    const uriToTry = configuredUri || localUri;
    await mongoose.connect(uriToTry);
    console.log(`✓ MongoDB connected successfully (${uriToTry})`);
    return mongoose.connection;
  } catch (error) {
    console.warn('⚠️ Failed to connect to configured MongoDB, falling back to in-memory server.', error);
    try {
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('✓ Connected to in-memory MongoDB (development fallback)');
      return mongoose.connection;
    } catch (memErr) {
      console.error('✗ In-memory MongoDB failed to start:', memErr);
      process.exit(1);
    }
  }
};

export default connectDB;
