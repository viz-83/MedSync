const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Doctor = require('./models/doctorModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

const doctors = [
    {
        name: "Dr. Rajesh Sharma",
        email: "rajesh.sharma@example.com",
        specialization: "Cardiologist",
        hospitalName: "Apollo Heart Institute",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        fullAddress: "12 Marine Drive, Mumbai, MH",
        coordinates: [72.8777, 19.0760],
        bgTime: "09:00",
        endTime: "14:00",
        days: [1, 2, 3, 4, 5] // Mon-Fri
    },
    {
        name: "Dr. Ananya Gupta",
        email: "ananya.gupta@example.com",
        specialization: "Dermatologist",
        hospitalName: "Skin Care Clinic",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        fullAddress: "45 Connaught Place, New Delhi, DL",
        coordinates: [77.1025, 28.7041],
        bgTime: "10:00",
        endTime: "18:00",
        days: [1, 3, 5] // Mon, Wed, Fri
    },
    {
        name: "Dr. Priya Iyer",
        email: "priya.iyer@example.com",
        specialization: "Pediatrician",
        hospitalName: "Child Health Center",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        fullAddress: "89 MG Road, Bangalore, KA",
        coordinates: [77.5946, 12.9716],
        bgTime: "08:00",
        endTime: "12:00",
        days: [2, 4, 6] // Tue, Thu, Sat
    },
    {
        name: "Dr. Vikram Singh",
        email: "vikram.singh@example.com",
        specialization: "General Physician",
        hospitalName: "City Care Hospital",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        fullAddress: "101 Banjara Hills, Hyderabad, TG",
        coordinates: [78.4867, 17.3850],
        bgTime: "14:00",
        endTime: "20:00",
        days: [1, 2, 3, 4, 5]
    },
    {
        name: "Dr. Meera Nair",
        email: "meera.nair@example.com",
        specialization: "Gynecologist",
        hospitalName: "Women's Wellness Wing",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001",
        fullAddress: "202 Anna Salai, Chennai, TN",
        coordinates: [80.2707, 13.0827],
        bgTime: "09:00",
        endTime: "17:00",
        days: [1, 2, 3, 4, 5]
    },
    {
        name: "Dr. Arjun Verma",
        email: "arjun.verma@example.com",
        specialization: "Orthopedic",
        hospitalName: "Bone & Joint Clinic",
        city: "Kolkata",
        state: "West Bengal",
        pincode: "700001",
        fullAddress: "305 Park Street, Kolkata, WB",
        coordinates: [88.3639, 22.5726],
        bgTime: "10:00",
        endTime: "16:00",
        days: [1, 2, 3, 4, 5]
    },
    {
        name: "Dr. Sanjay Rao",
        email: "sanjay.rao@example.com",
        specialization: "Neurologist",
        hospitalName: "Neuro Care Institute",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        fullAddress: "500 FC Road, Pune, MH",
        coordinates: [73.8567, 18.5204],
        bgTime: "11:00",
        endTime: "19:00",
        days: [1, 2, 3, 4, 5]
    },
    {
        name: "Dr. Neha Patel",
        email: "neha.patel@example.com",
        specialization: "Dentist",
        hospitalName: "Bright Smiles Dental",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
        fullAddress: "77 SG Highway, Ahmedabad, GJ",
        coordinates: [72.5714, 23.0225],
        bgTime: "09:00",
        endTime: "17:00",
        days: [1, 2, 3, 4, 5, 6]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log('DB Connected!');

        // 1. Clear existing generic dummy doctors (optional, be careful not to delete real ones if this was prod)
        // For dev, we might want to clear strictly these emails or clear all.
        // Let's clear users with these specific emails to avoid duplicates.
        const emails = doctors.map(d => d.email);

        // Find users to delete
        const usersToDelete = await User.find({ email: { $in: emails } });
        const userIds = usersToDelete.map(u => u._id);

        if (userIds.length > 0) {
            await Doctor.deleteMany({ user: { $in: userIds } });
            await User.deleteMany({ _id: { $in: userIds } });
            console.log(`Cleaned up ${userIds.length} existing dummy accounts.`);
        }

        // 2. Create new
        const password = await bcrypt.hash('pass1234', 12);

        for (const doc of doctors) {
            // Create User
            const user = await User.create({
                name: doc.name,
                email: doc.email,
                password: password,
                role: 'doctor',
                isVerified: true
            });

            // Create Availability Slots
            const availabilitySlots = doc.days.map(day => ({
                dayOfWeek: day,
                startTime: doc.bgTime,
                endTime: doc.endTime
            }));

            // Create Doctor Profile
            await Doctor.create({
                user: user._id,
                name: doc.name,
                specialization: doc.specialization,
                hospitalName: doc.hospitalName,
                location: {
                    city: doc.city,
                    state: doc.state,
                    pincode: doc.pincode,
                    fullAddress: doc.fullAddress,
                    coordinates: {
                        type: 'Point',
                        coordinates: doc.coordinates
                    }
                },
                availabilitySlots
            });

            console.log(`Created ${doc.name}`);
        }

        console.log('Data Imported Successfully!');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
