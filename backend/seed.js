const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./configuration/mongoose_configuration");

const User = require("./models/User");
const WasteBatch = require("./models/WasteBatch");
const Facility = require("./models/Facility");
const WasteMatch = require("./models/WasteMatch");
const Negotiation = require("./models/Negotiation");
const Shipment = require("./models/Shipment");
const Payment = require("./models/Payment");
const CarbonRecord = require("./models/CarbonRecord");
const WastePassport = require("./models/WastePassport");

const bcrypt = require("bcrypt");

const password = "Demo@123";

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log("Clearing demo collections...");

        await Promise.all([
            WastePassport.deleteMany({}),
            CarbonRecord.deleteMany({}),
            Payment.deleteMany({}),
            Shipment.deleteMany({}),
            Negotiation.deleteMany({}),
            WasteMatch.deleteMany({}),
            WasteBatch.deleteMany({}),
            Facility.deleteMany({}),
            User.deleteMany({
                email: {
                    $in: [
                        "generator1@carbonchain.demo",
                        "generator2@carbonchain.demo",
                        "generator3@carbonchain.demo",
                        "facility1@carbonchain.demo",
                        "facility2@carbonchain.demo",
                        "logistics1@carbonchain.demo",
                        "logistics2@carbonchain.demo",
                        "admin@carbonchain.demo"
                    ]
                }
            })
        ]);

        const hashedPassword = await bcrypt.hash(password, 10);

        // ==========================================
        // USERS
        // ==========================================

        const users = await User.insertMany([
            {
                name: "Rahul Sharma",
                email: "generator1@carbonchain.demo",
                password: hashedPassword,
                phone: "9876500001",
                role: "WASTE_GENERATOR",
                organization: "Green Harvest Farms",
                location: {
                    address: "Ahmedabad",
                    city: "Ahmedabad",
                    state: "Gujarat",
                    pincode: "380001"
                },
                aadhaarVerification: {
                    status: "VERIFIED"
                },
                accountStatus: "ACTIVE"
            },
            {
                name: "Priya Patel",
                email: "generator2@carbonchain.demo",
                password: hashedPassword,
                phone: "9876500002",
                role: "WASTE_GENERATOR",
                organization: "Patel Agro Industries",
                location: {
                    address: "Anand",
                    city: "Anand",
                    state: "Gujarat",
                    pincode: "388001"
                },
                aadhaarVerification: {
                    status: "VERIFIED"
                },
                accountStatus: "ACTIVE"
            },
            {
                name: "Amit Verma",
                email: "generator3@carbonchain.demo",
                password: hashedPassword,
                phone: "9876500003",
                role: "WASTE_GENERATOR",
                organization: "Fresh Foods Pvt Ltd",
                location: {
                    address: "Vadodara",
                    city: "Vadodara",
                    state: "Gujarat",
                    pincode: "390001"
                },
                aadhaarVerification: {
                    status: "VERIFIED"
                },
                accountStatus: "ACTIVE"
            },
            {
                name: "Neha Shah",
                email: "facility1@carbonchain.demo",
                password: hashedPassword,
                phone: "9876500011",
                role: "FACILITY",
                organization: "Blue Earth Biochar Plant",
                location: {
                    address: "Nadiad",
                    city: "Nadiad",
                    state: "Gujarat",
                    pincode: "387001"
                },
                aadhaarVerification: {
                    status: "VERIFIED"
                },
                accountStatus: "ACTIVE"
            },
            {
                name: "Vikram Mehta",
                email: "facility2@carbonchain.demo",
                password: hashedPassword,
                phone: "9876500012",
                role: "FACILITY",
                organization: "EcoCycle Processing Unit",
                location: {
                    address: "Ahmedabad",
                    city: "Ahmedabad",
                    state: "Gujarat",
                    pincode: "380015"
                },
                aadhaarVerification: {
                    status: "VERIFIED"
                },
                accountStatus: "ACTIVE"
            },
            {
                name: "Rakesh Kumar",
                email: "logistics1@carbonchain.demo",
                password: hashedPassword,
                phone: "9876500021",
                role: "LOGISTICS_PROVIDER",
                organization: "GreenRoute Logistics",
                location: {
                    address: "Ahmedabad",
                    city: "Ahmedabad",
                    state: "Gujarat",
                    pincode: "380009"
                },
                aadhaarVerification: {
                    status: "VERIFIED"
                },
                accountStatus: "ACTIVE"
            },
            {
                name: "Sanjay Joshi",
                email: "logistics2@carbonchain.demo",
                password: hashedPassword,
                phone: "9876500022",
                role: "LOGISTICS_PROVIDER",
                organization: "EcoMove Transport",
                location: {
                    address: "Vadodara",
                    city: "Vadodara",
                    state: "Gujarat",
                    pincode: "390002"
                },
                aadhaarVerification: {
                    status: "VERIFIED"
                },
                accountStatus: "ACTIVE"
            },
            {
                name: "CarbonChain Admin",
                email: "admin@carbonchain.demo",
                password: hashedPassword,
                phone: "9876500099",
                role: "ADMIN",
                organization: "CarbonChain",
                accountStatus: "ACTIVE"
            }
        ]);

        const [
            generator1,
            generator2,
            generator3,
            facilityOwner1,
            facilityOwner2,
            logistics1,
            logistics2,
            admin
        ] = users;

        // ==========================================
        // FACILITIES
        // ==========================================

        const facilities = await Facility.insertMany([
            {
                owner: facilityOwner1._id,
                facilityName: "Blue Earth Biochar Plant",
                facilityType: "BIOCHAR",
                acceptedWasteTypes: [
                    "Rice Husk",
                    "Crop Residue",
                    "Agricultural Waste"
                ],
                processingCapacity: {
                    value: 100,
                    unit: "TON_PER_DAY"
                },
                location: {
                    address: "Nadiad Industrial Area",
                    city: "Nadiad",
                    state: "Gujarat",
                    pincode: "387001",
                    latitude: 22.6916,
                    longitude: 72.8634
                },
                pricing: "BUY_WASTE",
                pricePerUnit: 8500,
                description:
                    "Biochar production from agricultural biomass.",
                operationalStatus: "ACTIVE",
                verificationStatus: "VERIFIED"
            },
            {
                owner: facilityOwner2._id,
                facilityName: "EcoCycle Recycling Facility",
                facilityType: "RECYCLING",
                acceptedWasteTypes: [
                    "Food Waste",
                    "Organic Waste",
                    "Paper Waste"
                ],
                processingCapacity: {
                    value: 80,
                    unit: "TON_PER_DAY"
                },
                location: {
                    address: "Ahmedabad Industrial Estate",
                    city: "Ahmedabad",
                    state: "Gujarat",
                    pincode: "380015",
                    latitude: 22.5246,
                    longitude: 72.5714
                },
                pricing: "NEGOTIABLE",
                pricePerUnit: 9000,
                description:
                    "Organic waste recycling and resource recovery.",
                operationalStatus: "ACTIVE",
                verificationStatus: "VERIFIED"
            }
        ]);

        const [facility1, facility2] = facilities;

        // ==========================================
        // WASTE BATCHES
        // ==========================================

        const waste1 = await WasteBatch.create({
            generator: generator1._id,
            wasteType: "Rice Husk",
            quantity: {
                value: 25,
                unit: "TON"
            },
            quality: "Dry and clean agricultural residue",
            location: {
                address: "Green Harvest Farms",
                city: "Ahmedabad",
                state: "Gujarat",
                pincode: "380001",
                latitude: 22.5533,
                longitude: 72.9233
            },
            availabilityDate: new Date(),
            pricingType: "NEGOTIABLE",
            askingPrice: 9000,
            description:
                "Rice husk available for biochar processing.",
            status: "MATCHED",
            facility: facility1._id
        });

        const waste2 = await WasteBatch.create({
            generator: generator2._id,
            wasteType: "Food Waste",
            quantity: {
                value: 15,
                unit: "TON"
            },
            quality: "Fresh organic food waste",
            location: {
                address: "Patel Agro Industries",
                city: "Anand",
                state: "Gujarat",
                pincode: "388001",
                latitude: 22.5645,
                longitude: 72.9289
            },
            availabilityDate: new Date(),
            pricingType: "SELL",
            askingPrice: 7000,
            description:
                "Organic food waste for resource recovery.",
            status: "NEGOTIATED",
            facility: facility2._id
        });

        const waste3 = await WasteBatch.create({
            generator: generator3._id,
            wasteType: "Crop Residue",
            quantity: {
                value: 40,
                unit: "TON"
            },
            quality: "Dry crop residue",
            location: {
                address: "Fresh Foods Facility",
                city: "Vadodara",
                state: "Gujarat",
                pincode: "390001",
                latitude: 22.3072,
                longitude: 73.1812
            },
            availabilityDate: new Date(),
            pricingType: "NEGOTIABLE",
            askingPrice: 11000,
            description:
                "Large quantity of dry crop residue.",
            status: "IN_TRANSIT",
            facility: facility1._id
        });

        const waste4 = await WasteBatch.create({
            generator: generator1._id,
            wasteType: "Agricultural Waste",
            quantity: {
                value: 10,
                unit: "TON"
            },
            quality: "Mixed agricultural biomass",
            location: {
                address: "Green Harvest Farms",
                city: "Ahmedabad",
                state: "Gujarat",
                pincode: "380001",
                latitude: 22.5533,
                longitude: 72.9233
            },
            availabilityDate: new Date(),
            pricingType: "FREE_PICKUP",
            askingPrice: 0,
            description:
                "Agricultural waste available for processing.",
            status: "RECEIVED",
            facility: facility1._id
        });

        const waste5 = await WasteBatch.create({
            generator: generator2._id,
            wasteType: "Organic Waste",
            quantity: {
                value: 8,
                unit: "TON"
            },
            quality: "High moisture organic waste",
            location: {
                address: "Patel Agro Industries",
                city: "Anand",
                state: "Gujarat",
                pincode: "388001",
                latitude: 22.5645,
                longitude: 72.9289
            },
            availabilityDate: new Date(),
            pricingType: "NEGOTIABLE",
            askingPrice: 6000,
            description:
                "Organic waste processed into useful products.",
            status: "PROCESSED",
            facility: facility2._id
        });

        // ==========================================
        // WASTE MATCHES
        // ==========================================

        const matches = await WasteMatch.insertMany([
            {
                wasteBatch: waste1._id,
                facility: facility1._id,
                matchScore: 95,
                distance: 34.21,
                status: "ACCEPTED"
            },
            {
                wasteBatch: waste1._id,
                facility: facility2._id,
                matchScore: 42,
                distance: 39.87,
                status: "SUGGESTED"
            },
            {
                wasteBatch: waste2._id,
                facility: facility2._id,
                matchScore: 91,
                distance: 12.44,
                status: "ACCEPTED"
            },
            {
                wasteBatch: waste3._id,
                facility: facility1._id,
                matchScore: 93,
                distance: 28.51,
                status: "ACCEPTED"
            },
            {
                wasteBatch: waste4._id,
                facility: facility1._id,
                matchScore: 88,
                distance: 34.21,
                status: "COMPLETED"
            },
            {
                wasteBatch: waste5._id,
                facility: facility2._id,
                matchScore: 90,
                distance: 12.44,
                status: "COMPLETED"
            }
        ]);

        // ==========================================
        // NEGOTIATIONS
        // ==========================================

        const negotiation1 = await Negotiation.create({
            wasteBatch: waste1._id,
            facility: facility1._id,
            generator: generator1._id,
            currentOffer: 8500,
            offers: [
                {
                    sender: generator1._id,
                    amount: 9000,
                    message:
                        "Initial offer for 25 tons of Rice Husk.",
                    status: "COUNTERED"
                },
                {
                    sender: facilityOwner1._id,
                    amount: 8200,
                    message: "Facility counter offer.",
                    status: "COUNTERED"
                },
                {
                    sender: generator1._id,
                    amount: 8500,
                    message: "Final negotiated offer.",
                    status: "PENDING"
                }
            ],
            status: "ACTIVE"
        });

        const negotiation2 = await Negotiation.create({
            wasteBatch: waste2._id,
            facility: facility2._id,
            generator: generator2._id,
            currentOffer: 6500,
            offers: [
                {
                    sender: generator2._id,
                    amount: 7000,
                    message: "Initial offer.",
                    status: "COUNTERED"
                },
                {
                    sender: facilityOwner2._id,
                    amount: 6500,
                    message:
                        "Counter offer accepted by generator.",
                    status: "ACCEPTED"
                }
            ],
            status: "ACCEPTED",
            agreedPrice: 6500,
            agreedAt: new Date()
        });

        const negotiation3 = await Negotiation.create({
            wasteBatch: waste3._id,
            facility: facility1._id,
            generator: generator3._id,
            currentOffer: 10500,
            offers: [
                {
                    sender: generator3._id,
                    amount: 11000,
                    message: "Initial offer.",
                    status: "COUNTERED"
                },
                {
                    sender: facilityOwner1._id,
                    amount: 10500,
                    message: "Counter offer.",
                    status: "ACCEPTED"
                }
            ],
            status: "ACCEPTED",
            agreedPrice: 10500,
            agreedAt: new Date()
        });

        const negotiation4 = await Negotiation.create({
            wasteBatch: waste4._id,
            facility: facility1._id,
            generator: generator1._id,
            currentOffer: 0,
            offers: [
                {
                    sender: generator1._id,
                    amount: 0,
                    message: "Free pickup arrangement.",
                    status: "ACCEPTED"
                }
            ],
            status: "ACCEPTED",
            agreedPrice: 0,
            agreedAt: new Date()
        });

        // ==========================================
        // PAYMENTS
        // ==========================================

        await Payment.create({
            wasteBatch: waste2._id,
            negotiation: negotiation2._id,
            generator: generator2._id,
            facility: facility2._id,
            amount: 6500,
            currency: "INR",
            paymentMethod: "DEMO",
            status: "SUCCESS",
            paidAt: new Date()
        });

        await Payment.create({
            wasteBatch: waste3._id,
            negotiation: negotiation3._id,
            generator: generator3._id,
            facility: facility1._id,
            amount: 10500,
            currency: "INR",
            paymentMethod: "DEMO",
            status: "SUCCESS",
            paidAt: new Date()
        });

        await Payment.create({
            wasteBatch: waste4._id,
            negotiation: negotiation4._id,
            generator: generator1._id,
            facility: facility1._id,
            amount: 0,
            currency: "INR",
            paymentMethod: "DEMO",
            status: "SUCCESS",
            paidAt: new Date()
        });

        // ==========================================
        // SHIPMENTS
        // ==========================================

        const shipment1 = await Shipment.create({
            wasteBatch: waste3._id,
            negotiation: negotiation3._id,
            generator: generator3._id,
            facility: facility1._id,
            logisticsProvider: logistics1._id,
            vehicleNumber: "GJ05AB1234",
            driverName: "Rakesh Kumar",
            driverPhone: "9876500021",
            pickupLocation: waste3.location,
            deliveryLocation: facility1.location,
            route: {
                distance: 28.51,
                estimatedTime: 43
            },
            status: "IN_TRANSIT",
            pickupDate: new Date(
                Date.now() - 2 * 60 * 60 * 1000
            )
        });

        const shipment2 = await Shipment.create({
            wasteBatch: waste4._id,
            negotiation: negotiation4._id,
            generator: generator1._id,
            facility: facility1._id,
            logisticsProvider: logistics2._id,
            vehicleNumber: "GJ06CD5678",
            driverName: "Sanjay Joshi",
            driverPhone: "9876500022",
            pickupLocation: waste4.location,
            deliveryLocation: facility1.location,
            route: {
                distance: 34.21,
                estimatedTime: 52
            },
            status: "DELIVERED",
            pickupDate: new Date(
                Date.now() - 5 * 60 * 60 * 1000
            ),
            deliveredDate: new Date(
                Date.now() - 60 * 60 * 1000
            )
        });

        // ==========================================
        // CARBON RECORDS
        // ==========================================

        const carbon1 = await CarbonRecord.create({
            wasteBatch: waste5._id,
            facility: facility2._id,
            wasteType: waste5.wasteType,
            quantity: waste5.quantity,
            processingMethod: "COMPOSTING",
            carbonFactor: 0.42,
            co2eAvoided: 3.36,
            calculationBasis:
                "Demo calculation: 8 TON × 0.42 tCO2e/TON"
        });

        const carbon2 = await CarbonRecord.create({
            wasteBatch: waste4._id,
            facility: facility1._id,
            wasteType: waste4.wasteType,
            quantity: waste4.quantity,
            processingMethod: "BIOCHAR",
            carbonFactor: 0.75,
            co2eAvoided: 7.5,
            calculationBasis:
                "Demo calculation: 10 TON × 0.75 tCO2e/TON"
        });

        // ==========================================
        // DIGITAL WASTE PASSPORTS
        // ==========================================

        const passportId = (number) =>
            `CC-DEMO-${String(number).padStart(4, "0")}`;

        await WastePassport.insertMany([
            {
                wasteBatch: waste1._id,
                generator: generator1._id,
                facility: facility1._id,
                negotiation: negotiation1._id,
                passportId: passportId(1),
                wasteType: waste1.wasteType,
                quantity: waste1.quantity,
                lifecycleStatus: "NEGOTIATED",
                origin: waste1.location,
                destination: facility1.location,
                events: [
                    {
                        status: "REGISTERED",
                        description:
                            "Waste batch registered on CarbonChain"
                    },
                    {
                        status: "MATCHED",
                        description:
                            "Waste matched with Blue Earth Biochar Plant"
                    },
                    {
                        status: "NEGOTIATED",
                        description:
                            "Price negotiation is currently active"
                    }
                ]
            },
            {
                wasteBatch: waste2._id,
                generator: generator2._id,
                facility: facility2._id,
                negotiation: negotiation2._id,
                passportId: passportId(2),
                wasteType: waste2.wasteType,
                quantity: waste2.quantity,
                lifecycleStatus: "PAID",
                origin: waste2.location,
                destination: facility2.location,
                events: [
                    {
                        status: "REGISTERED",
                        description:
                            "Waste batch registered on CarbonChain"
                    },
                    {
                        status: "MATCHED",
                        description:
                            "Waste matched with EcoCycle Recycling Facility"
                    },
                    {
                        status: "NEGOTIATED",
                        description:
                            "Negotiation completed successfully"
                    },
                    {
                        status: "PAID",
                        description:
                            "Payment completed successfully"
                    }
                ]
            },
            {
                wasteBatch: waste3._id,
                generator: generator3._id,
                facility: facility1._id,
                negotiation: negotiation3._id,
                shipment: shipment1._id,
                passportId: passportId(3),
                wasteType: waste3.wasteType,
                quantity: waste3.quantity,
                lifecycleStatus: "IN_TRANSIT",
                origin: waste3.location,
                destination: facility1.location,
                events: [
                    {
                        status: "REGISTERED",
                        description:
                            "Waste batch registered on CarbonChain"
                    },
                    {
                        status: "MATCHED",
                        description:
                            "Waste matched with Blue Earth Biochar Plant"
                    },
                    {
                        status: "NEGOTIATED",
                        description:
                            "Negotiation completed successfully"
                    },
                    {
                        status: "PAID",
                        description:
                            "Payment completed successfully"
                    },
                    {
                        status: "COLLECTED",
                        description:
                            "Waste collected from generator"
                    },
                    {
                        status: "IN_TRANSIT",
                        description:
                            "Waste is currently in transit"
                    }
                ]
            },
            {
                wasteBatch: waste4._id,
                generator: generator1._id,
                facility: facility1._id,
                negotiation: negotiation4._id,
                shipment: shipment2._id,
                carbonRecord: carbon2._id,
                passportId: passportId(4),
                wasteType: waste4.wasteType,
                quantity: waste4.quantity,
                lifecycleStatus: "PROCESSED",
                origin: waste4.location,
                destination: facility1.location,
                processingMethod: "BIOCHAR",
                carbonImpact: {
                    co2eAvoided: 7.5,
                    carbonFactor: 0.75
                },
                events: [
                    {
                        status: "REGISTERED",
                        description:
                            "Waste batch registered on CarbonChain"
                    },
                    {
                        status: "MATCHED",
                        description:
                            "Waste matched with Blue Earth Biochar Plant"
                    },
                    {
                        status: "NEGOTIATED",
                        description:
                            "Negotiation completed successfully"
                    },
                    {
                        status: "PAID",
                        description:
                            "Transaction payment completed"
                    },
                    {
                        status: "COLLECTED",
                        description:
                            "Waste collected from generator"
                    },
                    {
                        status: "IN_TRANSIT",
                        description:
                            "Waste transported to facility"
                    },
                    {
                        status: "RECEIVED",
                        description:
                            "Waste received at processing facility"
                    },
                    {
                        status: "PROCESSED",
                        description:
                            "Waste processed and carbon impact recorded"
                    }
                ]
            },
            {
                wasteBatch: waste5._id,
                generator: generator2._id,
                facility: facility2._id,
                negotiation: negotiation2._id,
                carbonRecord: carbon1._id,
                passportId: passportId(5),
                wasteType: waste5.wasteType,
                quantity: waste5.quantity,
                lifecycleStatus: "PROCESSED",
                origin: waste5.location,
                destination: facility2.location,
                processingMethod: "COMPOSTING",
                carbonImpact: {
                    co2eAvoided: 3.36,
                    carbonFactor: 0.42
                },
                events: [
                    {
                        status: "REGISTERED",
                        description:
                            "Waste batch registered on CarbonChain"
                    },
                    {
                        status: "MATCHED",
                        description:
                            "Waste matched with EcoCycle Recycling Facility"
                    },
                    {
                        status: "NEGOTIATED",
                        description:
                            "Negotiation completed successfully"
                    },
                    {
                        status: "PAID",
                        description:
                            "Transaction payment completed"
                    },
                    {
                        status: "RECEIVED",
                        description:
                            "Waste received at processing facility"
                    },
                    {
                        status: "PROCESSED",
                        description:
                            "Waste processed and carbon impact recorded"
                    }
                ]
            }
        ]);

        // ==========================================
        // DONE
        // ==========================================

        console.log("\n========================================");
        console.log(" CarbonChain demo database seeded!");
        console.log("========================================");

        console.log("\nDemo password for all users:");
        console.log(password);

        console.log("\nUsers:");
        console.log(
            "Generator: ",
            "generator1@carbonchain.demo"
        );
        console.log(
            "Generator: ",
            "generator2@carbonchain.demo"
        );
        console.log(
            "Generator: ",
            "generator3@carbonchain.demo"
        );
        console.log(
            "Facility:  ",
            "facility1@carbonchain.demo"
        );
        console.log(
            "Facility:  ",
            "facility2@carbonchain.demo"
        );
        console.log(
            "Logistics: ",
            "logistics1@carbonchain.demo"
        );
        console.log(
            "Logistics: ",
            "logistics2@carbonchain.demo"
        );
        console.log(
            "Admin:     ",
            "admin@carbonchain.demo"
        );

        console.log("\nSeeded:");
        console.log("Users:          ", users.length);
        console.log("Facilities:     ", facilities.length);
        console.log("Waste Batches:  ", 5);
        console.log("Matches:        ", matches.length);
        console.log("Negotiations:   ", 4);
        console.log("Payments:       ", 3);
        console.log("Shipments:      ", 2);
        console.log("Carbon Records: ", 2);
        console.log("Passports:      ", 5);

        console.log("\n========================================\n");

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("\nSeed failed:", error);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();