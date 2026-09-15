import mongoose from "mongoose";

async function fixReplicaSet() {
  try {
    // directConnection allows Mongoose to connect to an uninitialized replica set node
    console.log("Connecting to local MongoDB...");
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/admin?directConnection=true",
    );

    console.log("Initiating Replica Set...");
    const admin = mongoose.connection.db.admin();
    const result = await admin.command({ replSetInitiate: {} });

    console.log("SUCCESS:", result);
  } catch (error) {
    console.error("Initialization status/error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

fixReplicaSet();
