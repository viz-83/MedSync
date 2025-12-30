const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const HealthMetric = require('../models/healthMetricModel');

dotenv.config({ path: path.join(__dirname, '../.env') });

const wipe = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const result = await HealthMetric.deleteMany({});
        console.log(`Deleted ${result.deletedCount} corrupted health metrics.`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error wiping data:', error);
        process.exit(1);
    }
};

wipe();
