require('dotenv').config();
const app = require('./app');
const { connectDB, sequelize } = require('./config/database');
const { verifyMailer } = require('./config/mailer');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Sync Models (Uncomment with care in production)
    // await sequelize.sync({ alter: true });
    // console.log('✅  Database models synchronized');

    // 3. Verify Mailer
    await verifyMailer();

    // 4. Start Server
    app.listen(PORT, () => {
      console.log(`🚀  Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
