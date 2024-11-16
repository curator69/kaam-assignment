for creating a user:
POST /api/auth/register
Body: {
"name": "John Doe",
"email": "john@example.com",
"password": "password123",
"role": "employee"
}

for logging in:
POST /api/auth/login
Body: {
"email": "john@example.com",
"password": "password123"
}
