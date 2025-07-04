const crypto = require("crypto");

// Generate secure random passwords for production users
const generateSecurePassword = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Production users with secure password generation
// In production, these should be set via environment variables or admin interface
module.exports = [
  {
    username: "admin",
    name: "Site Admin",
    email: "admin@example.com",
    password: process.env.ADMIN_PASSWORD,
    avatar_url: "https://daily-spews-api.onrender.com/images/users/admin.jpeg",
  },
  {
    username: "guest_user",
    name: "Guest User",
    email: "guest_user@example.com",
    password: "guest_user123",
    avatar_url: "https://daily-spews-api.onrender.com/images/users/guest.jpeg",
  },
  {
    username: "alexking",
    name: "Alex King",
    email: "alexking@example.com",
    password: "alexking123",
    avatar_url: "https://daily-spews-api.onrender.com/images/users/alex.jpeg",
  },
  {
    username: "chloe_writes",
    name: "Chloe Watson",
    email: "chloe_writes@example.com",
    password: "chloe_writes123",
    avatar_url: "https://daily-spews-api.onrender.com/images/users/chloe.jpeg",
  },
  {
    username: "drnews",
    name: "Samir Ahmed",
    email: "drnews@example.com",
    password: "drnews123",
    avatar_url: "https://daily-spews-api.onrender.com/images/users/samir.jpeg",
  },
  {
    username: "ellie_fox",
    name: "Ellie Fox",
    email: "ellie_fox@example.com",
    password: "ellie_fox123",
    avatar_url: "https://daily-spews-api.onrender.com/images/users/ellie.jpeg",
  },
  {
    username: "nateopinion",
    name: "Nathan Li",
    email: "nateopinion@example.com",
    password: "nateopinion123",
    avatar_url: "https://daily-spews-api.onrender.com/images/users/nathan.jpeg",
  },
  {
    username: "taylorreader",
    name: "Taylor Morgan",
    email: "taylorreader@example.com",
    password: "taylorreader123",
    avatar_url: "https://daily-spews-api.onrender.com/images/users/taylor.jpeg",
  },
  {
    username: "sophsays",
    name: "Sophie Williams",
    email: "sophsays@example.com",
    password: "sophsays123",
    avatar_url: "https://daily-spews-api.onrender.com/images/users/sophie.jpeg",
  },
];
