// MongoDB seed script for AI Jobs Portal
// Run with: mongo ai_jobs_portal seed.js

// Clear existing data
db.job_seekers.drop();
db.recruiters.drop();
db.admins.drop();
db.jobs.drop();
db.applications.drop();

// Insert sample job seekers
db.job_seekers.insertMany([
  {
    _id: ObjectId(),
    email: "john.doe@email.com",
    password: "$2b$10$example_hash_1", // In production, use proper bcrypt hash
    first_name: "John",
    last_name: "Doe",
    phone: "+1234567890",
    user_type: "job_seeker",
    created_at: new Date(),
    updated_at: new Date(),
    profile_completed: true,
    skills: ["Python", "JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    experience: [
      {
        company: "Tech Corp",
        position: "Full Stack Developer",
        duration: "2 years",
        location: "San Francisco, CA"
      }
    ],
    education: [
      {
        degree: "Bachelor of Computer Science",
        institution: "University of California",
        year: "2020"
      }
    ],
    applications: [],
    saved_jobs: [],
    preferences: {
      job_types: ["Full-time", "Remote"],
      locations: ["San Francisco", "Remote"],
      salary_range: { min: 80000, max: 120000 },
      remote_work: true
    }
  },
  {
    _id: ObjectId(),
    email: "jane.smith@email.com",
    password: "$2b$10$example_hash_2",
    first_name: "Jane",
    last_name: "Smith",
    phone: "+1234567891",
    user_type: "job_seeker",
    created_at: new Date(),
    updated_at: new Date(),
    profile_completed: true,
    skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL", "Data Science"],
    experience: [
      {
        company: "Data Analytics Inc",
        position: "Data Scientist",
        duration: "3 years",
        location: "New York, NY"
      }
    ],
    education: [
      {
        degree: "Master of Data Science",
        institution: "Columbia University",
        year: "2019"
      }
    ],
    applications: [],
    saved_jobs: [],
    preferences: {
      job_types: ["Full-time"],
      locations: ["New York", "Boston"],
      salary_range: { min: 90000, max: 140000 },
      remote_work: false
    }
  }
]);

// Insert sample recruiters
db.recruiters.insertMany([
  {
    _id: ObjectId(),
    email: "hr@techstartup.com",
    password: "$2b$10$example_hash_3",
    first_name: "Sarah",
    last_name: "Johnson",
    phone: "+1234567892",
    user_type: "recruiter",
    company_name: "TechStartup Inc",
    company_size: "50-200",
    industry: "Technology",
    website: "https://techstartup.com",
    created_at: new Date(),
    updated_at: new Date(),
    company_verified: true,
    jobs_posted: [],
    total_applications: 0
  },
  {
    _id: ObjectId(),
    email: "recruiting@bigcorp.com",
    password: "$2b$10$example_hash_4",
    first_name: "Mike",
    last_name: "Wilson",
    phone: "+1234567893",
    user_type: "recruiter",
    company_name: "BigCorp Solutions",
    company_size: "1000+",
    industry: "Enterprise Software",
    website: "https://bigcorp.com",
    created_at: new Date(),
    updated_at: new Date(),
    company_verified: true,
    jobs_posted: [],
    total_applications: 0
  }
]);

// Insert sample admin
db.admins.insertMany([
  {
    _id: ObjectId(),
    email: "admin@aijobsportal.com",
    password: "$2b$10$example_hash_5",
    first_name: "Admin",
    last_name: "User",
    phone: "+1234567894",
    user_type: "admin",
    admin_level: "super",
    permissions: ["manage_users", "manage_jobs", "view_analytics", "manage_platform"],
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Insert sample jobs
db.jobs.insertMany([
  {
    _id: ObjectId(),
    title: "Senior Full Stack Developer",
    description: "We are looking for a senior full stack developer to join our growing team. You will be responsible for developing and maintaining our web applications using modern technologies.",
    company: "TechStartup Inc",
    location: "San Francisco, CA",
    job_type: "Full-time",
    salary_range: { min: 100000, max: 150000 },
    required_skills: ["Python", "JavaScript", "React", "Node.js", "MongoDB", "AWS"],
    experience_required: "3+ years",
    education_required: "Bachelor's degree in Computer Science or related field",
    recruiter_id: ObjectId(), // Will be updated with actual recruiter ID
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    applications_count: 0,
    views_count: 0
  },
  {
    _id: ObjectId(),
    title: "Data Scientist",
    description: "Join our data science team to work on exciting machine learning projects. You will be responsible for analyzing large datasets and building predictive models.",
    company: "BigCorp Solutions",
    location: "New York, NY",
    job_type: "Full-time",
    salary_range: { min: 120000, max: 180000 },
    required_skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL", "Statistics"],
    experience_required: "2+ years",
    education_required: "Master's degree in Data Science or related field",
    recruiter_id: ObjectId(), // Will be updated with actual recruiter ID
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    applications_count: 0,
    views_count: 0
  },
  {
    _id: ObjectId(),
    title: "Frontend Developer Intern",
    description: "Great opportunity for a frontend developer intern to work on our user interface. You will learn modern web development technologies and work with experienced developers.",
    company: "TechStartup Inc",
    location: "Remote",
    job_type: "Internship",
    salary_range: { min: 0, max: 0 },
    required_skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    experience_required: "No experience required",
    education_required: "Currently enrolled in Computer Science program",
    recruiter_id: ObjectId(), // Will be updated with actual recruiter ID
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    applications_count: 0,
    views_count: 0
  }
]);

// Update job recruiter IDs with actual recruiter IDs
var recruiters = db.recruiters.find().toArray();
var jobs = db.jobs.find().toArray();

db.jobs.updateOne(
  { title: "Senior Full Stack Developer" },
  { $set: { recruiter_id: recruiters[0]._id } }
);

db.jobs.updateOne(
  { title: "Data Scientist" },
  { $set: { recruiter_id: recruiters[1]._id } }
);

db.jobs.updateOne(
  { title: "Frontend Developer Intern" },
  { $set: { recruiter_id: recruiters[0]._id } }
);

// Insert sample applications
var jobSeekers = db.job_seekers.find().toArray();
var jobs = db.jobs.find().toArray();

db.applications.insertMany([
  {
    _id: ObjectId(),
    job_id: jobs[0]._id,
    job_seeker_id: jobSeekers[0]._id,
    cover_letter: "I am very interested in this position and believe my skills align well with your requirements.",
    resume_url: "/uploads/resume1.pdf",
    additional_info: "Available to start immediately",
    applied_at: new Date(),
    status: "applied",
    skill_match_percentage: 85.5,
    notes: "",
    interview_scheduled: false,
    interview_date: null,
    hiring_stage: "applied"
  },
  {
    _id: ObjectId(),
    job_id: jobs[1]._id,
    job_seeker_id: jobSeekers[1]._id,
    cover_letter: "I have extensive experience in data science and machine learning projects.",
    resume_url: "/uploads/resume2.pdf",
    additional_info: "Open to relocation",
    applied_at: new Date(),
    status: "shortlisted",
    skill_match_percentage: 92.3,
    notes: "Strong candidate with relevant experience",
    interview_scheduled: true,
    interview_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    hiring_stage: "interview"
  }
]);

print("Database seeded successfully!");
print("Sample data inserted:");
print("- 2 Job Seekers");
print("- 2 Recruiters");
print("- 1 Admin");
print("- 3 Jobs");
print("- 2 Applications");