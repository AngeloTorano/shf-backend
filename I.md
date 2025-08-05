# INSTRUCTIONS POSTMAN
First get the token

-- you can get the token from the http://localhost:3000/api/auth/login
header:
Content-Type : application/json

{
  "username": "admin2",
  "password": "adminPass123!"
}

-- upon login the postman response display

NOTE: make use the you login once, becasuse once you relogin the 1st token will expire and you need to change the current token in Authorization header

{
    "success": true,
    "message": "Login successful",
    "timestamp": "2025-08-05T15:55:32.401Z",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiYWRtaW4yIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzU0NDA5MzMyLCJleHAiOjE3NTQ0OTU3MzJ9.UUq8nNw6HtgXNymPA4f3X2jI0jWIzVeAfS68WuCoMCU",
        "user": {
            "user_id": 2,
            "username": "admin2",
            "first_name": "admin",
            "last_name": "admin",
            "email": "admin1@example.com",
            "roles": [
                "admin"
            ]
        }
    }
}

copy the token then insert into:
Headers:

Authorization : Bearer Token
Content-Type : application/json

this Headers are needed for request especially the Authorization Token 

for other data need for postman go to sample/post.json file for sample body

--ILOVEYOU--


