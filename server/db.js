const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Reuse the connection across warm serverless invocations by caching it on
// the global object, which persists between invocations in the same
// execution context (but not across cold starts).
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error('Missing required MONGODB_URI environment variable');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

module.exports = connectToDatabase;
