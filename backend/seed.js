require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Student = require('./models/Student');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Interview = require('./models/Interview');

const seedDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://gshashwat111:tshashwatagupta111@cluster0.qcegy1i.mongodb.net/placement_management?retryWrites=true&w=majority');
        console.log(`Connected to MongoDB Database for seeding (${conn.connection.name})...`);

        // Clear existing data
        await User.deleteMany({});
        await Student.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        await Interview.deleteMany({});
        console.log("Cleared existing data.");

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        const adminUser = await User.create({
            email: 'admin@college.edu',
            password: hashedPassword,
            role: 'admin'
        });

        const studentUsersData = [
            { email: 'student1@college.edu', password: hashedPassword, role: 'student' },
            { email: 'student2@college.edu', password: hashedPassword, role: 'student' },
            { email: 'student3@college.edu', password: hashedPassword, role: 'student' }
        ];
        const studentUsers = await User.insertMany(studentUsersData);

        // Create Complete Student Profiles with all required fields
        const studentsData = [
            {
                userId: studentUsers[0]._id,
                fullName: "John Doe",
                name: "John Doe",
                enrollmentNumber: "CS2024001",
                email: "student1@college.edu",
                collegeEmail: "student1@college.edu",
                personalEmail: "john.doe.personal@gmail.com",
                phone: "+91 9876543210",
                gender: "Male",
                degree: "B.Tech",
                branch: "Computer Science",
                semester: "8",
                cgpa: 8.5,
                tenthPercentage: 92,
                twelfthPercentage: 88,
                backlogs: "0",
                academicStatus: "Clear",
                primaryDomain: "Full Stack Development",
                primaryLanguage: "JavaScript",
                overallSkillLevel: "Intermediate",
                technicalSkills: ["React", "Node.js", "MongoDB", "Python"],
                databaseFamiliarity: "Medium",
                backendFamiliarity: "Medium",
                communicationLevel: "Good",
                problemSolvingLevel: "Medium",
                codingPlatform: "LeetCode",
                dsaLevel: "Intermediate",
                preferredJobType: "Full-time",
                preferredWorkMode: "Hybrid",
                preferredLocation: "Bengaluru",
                openToRelocation: "Yes",
                expectedCompensation: "10 LPA+",
                availabilityStatus: "Immediate",
                preferredCompanyType: "Product-based",
                offCampusInterest: "High",
                resumeLink: "https://example.com/resume-john.pdf",
                resumeStatus: "Pending",
                linkedIn: "https://linkedin.com/in/johndoe",
                github: "https://github.com/johndoe",
                profileVisibility: "Public",
                status: "Not Placed"
            },
            {
                userId: studentUsers[1]._id,
                fullName: "Jane Smith",
                name: "Jane Smith",
                enrollmentNumber: "IT2023002",
                email: "student2@college.edu",
                collegeEmail: "student2@college.edu",
                personalEmail: "jane.smith.personal@gmail.com",
                phone: "+91 9876543211",
                gender: "Female",
                degree: "B.Tech",
                branch: "Information Technology",
                semester: "6",
                cgpa: 9.2,
                tenthPercentage: 95,
                twelfthPercentage: 91,
                backlogs: "0",
                academicStatus: "Clear",
                primaryDomain: "Data Science",
                primaryLanguage: "Python",
                overallSkillLevel: "Advanced",
                technicalSkills: ["Python", "Machine Learning", "SQL", "Tableau"],
                databaseFamiliarity: "High",
                backendFamiliarity: "Medium",
                communicationLevel: "Excellent",
                problemSolvingLevel: "High",
                codingPlatform: "HackerRank",
                dsaLevel: "Advanced",
                preferredJobType: "Full-time",
                preferredWorkMode: "Remote",
                preferredLocation: "Mumbai",
                openToRelocation: "No",
                expectedCompensation: "15 LPA+",
                availabilityStatus: "3 months",
                preferredCompanyType: "Product-based",
                offCampusInterest: "Medium",
                resumeLink: "https://example.com/resume-jane.pdf",
                resumeStatus: "Verified",
                linkedIn: "https://linkedin.com/in/janesmith",
                github: "https://github.com/janesmith",
                profileVisibility: "Public",
                status: "Placed"
            },
            {
                userId: studentUsers[2]._id,
                fullName: "Sam Wilson",
                name: "Sam Wilson",
                enrollmentNumber: "MBA2022003",
                email: "student3@college.edu",
                collegeEmail: "student3@college.edu",
                personalEmail: "sam.wilson.personal@gmail.com",
                phone: "+91 9876543212",
                gender: "Male",
                degree: "MBA",
                branch: "Business Analytics",
                semester: "4",
                cgpa: 8.8,
                tenthPercentage: 89,
                twelfthPercentage: 85,
                backlogs: "0",
                academicStatus: "Clear",
                primaryDomain: "Business Analytics",
                primaryLanguage: "Python",
                overallSkillLevel: "Intermediate",
                technicalSkills: ["Python", "R", "SQL", "Excel"],
                databaseFamiliarity: "Medium",
                backendFamiliarity: "Low",
                communicationLevel: "Excellent",
                problemSolvingLevel: "Medium",
                codingPlatform: "None",
                dsaLevel: "Beginner",
                preferredJobType: "Full-time",
                preferredWorkMode: "Hybrid",
                preferredLocation: "Delhi",
                openToRelocation: "Yes",
                expectedCompensation: "12 LPA+",
                availabilityStatus: "Immediate",
                preferredCompanyType: "Consulting",
                offCampusInterest: "High",
                resumeLink: "https://example.com/resume-sam.pdf",
                resumeStatus: "Verified",
                linkedIn: "https://linkedin.com/in/samwilson",
                github: "https://github.com/samwilson",
                profileVisibility: "Public",
                status: "Not Placed"
            }
        ];
        const students = await Student.create(studentsData);

        // Create Jobs
        const jobs = await Job.insertMany([
            {
                company: "Google",
                role: "Software Engineer",
                salary: "$120,000",
                deadline: new Date("2026-05-15"),
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                tags: ["React", "Node.js", "MongoDB"],
                description: "Looking for a full-stack developer to join our team and build amazing products that impact billions of users worldwide. You'll work on cutting-edge technologies and solve complex problems at scale.",
                responsibilities: "Design, develop, and maintain scalable web applications. Collaborate with cross-functional teams to define and ship new features. Write clean, maintainable, and well-documented code. Participate in code reviews and contribute to technical discussions. Troubleshoot and debug production issues.",
                location: "Mountain View, CA (Hybrid)",
                opportunityType: "Full Time",
                employmentMode: "Hybrid",
                status: "Open",
                applied: false,
                type: "Full Time"
            },
            {
                company: "Microsoft",
                role: "Front-end Developer",
                salary: "$110,000",
                deadline: new Date("2026-06-01"),
                logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                tags: ["React", "TypeScript", "CSS"],
                description: "Join the Azure UI team to build scalable interfaces that power Microsoft's cloud services. You'll work on enterprise-grade applications used by millions of customers worldwide.",
                responsibilities: "Develop responsive and accessible user interfaces. Implement pixel-perfect designs from Figma/Sketch. Optimize applications for maximum speed and scalability. Work closely with UX designers and back-end developers. Ensure cross-browser compatibility and mobile responsiveness.",
                location: "Redmond, WA (Remote)",
                opportunityType: "Full Time",
                employmentMode: "Remote",
                status: "Open",
                applied: false,
                type: "Full Time"
            },
            {
                company: "Amazon",
                role: "Data Analyst",
                salary: "$95,000",
                deadline: new Date("2026-04-30"),
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                tags: ["Python", "SQL", "Tableau"],
                description: "Analyze vast amounts of data and provide actionable insights that drive business decisions at Amazon. You'll work with massive datasets and cutting-edge analytics tools.",
                responsibilities: "Collect, clean, and analyze large datasets from various sources. Create interactive dashboards and reports using Tableau. Develop predictive models to forecast business trends. Present findings to stakeholders and provide actionable recommendations. Collaborate with engineering teams to improve data collection processes.",
                location: "Seattle, WA (On-site)",
                opportunityType: "Internship",
                employmentMode: "On-site",
                status: "Open",
                applied: false,
                type: "Internship"
            },
            {
                company: "Apple",
                role: "iOS Developer",
                salary: "$130,000",
                deadline: new Date("2026-05-20"),
                logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                tags: ["Swift", "Objective-C"],
                description: "Develop seamless experiences for Apple users globally. Join the iOS team to build innovative applications that showcase the full potential of Apple's ecosystem.",
                responsibilities: "Design and develop native iOS applications. Collaborate with design teams to implement intuitive user interfaces. Optimize app performance and ensure smooth user experience. Write unit tests and maintain code quality standards. Stay updated with latest iOS technologies and best practices.",
                location: "Cupertino, CA (On-site)",
                opportunityType: "Full Time",
                employmentMode: "On-site",
                status: "Open",
                applied: false,
                type: "Full Time"
            }
        ]);

        // Create Applications
        const applications = await Application.insertMany([
            {
                studentId: students[0]._id,
                jobId: jobs[0]._id,
                studentName: students[0].fullName,
                company: jobs[0].company,
                role: jobs[0].role,
                logo: jobs[0].logo,
                status: "Applied",
                date: "2026-04-01"
            },
            {
                studentId: students[0]._id,
                jobId: jobs[1]._id,
                studentName: students[0].fullName,
                company: jobs[1].company,
                role: jobs[1].role,
                logo: jobs[1].logo,
                status: "Shortlisted",
                date: "2026-04-03"
            },
            {
                studentId: students[1]._id,
                jobId: jobs[2]._id,
                studentName: students[1].fullName,
                company: jobs[2].company,
                role: jobs[2].role,
                logo: jobs[2].logo,
                status: "Selected",
                date: "2026-03-15"
            },
            {
                studentId: students[2]._id,
                jobId: jobs[0]._id,
                studentName: students[2].fullName,
                company: jobs[0].company,
                role: jobs[0].role,
                logo: jobs[0].logo,
                status: "Rejected",
                date: "2026-04-05"
            }
        ]);

        // Create Interviews
        const interviews = await Interview.insertMany([
            {
                studentId: students[0]._id,
                jobId: jobs[1]._id,
                studentName: students[0].fullName,
                company: jobs[1].company,
                role: jobs[1].role,
                logo: jobs[1].logo,
                date: "2026-04-10",
                time: "10:00 AM",
                mode: "Online",
                status: "Upcoming"
            },
            {
                studentId: students[1]._id,
                jobId: jobs[2]._id,
                studentName: students[1].fullName,
                company: jobs[2].company,
                role: jobs[2].role,
                logo: jobs[2].logo,
                date: "2026-03-25",
                time: "02:00 PM",
                mode: "Offline",
                status: "Completed"
            },
            {
                studentId: students[2]._id,
                jobId: jobs[3]._id,
                studentName: students[2].fullName,
                company: jobs[3].company,
                role: jobs[3].role,
                logo: jobs[3].logo,
                date: "2026-04-12",
                time: "11:30 AM",
                mode: "Online",
                status: "Upcoming"
            }
        ]);

        console.log("Database seeded successfully with dummy data!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
