import requests
import json

BASE_URL = "http://localhost:5000/api"
RESULTS = []

def log(endpoint, method, status, request_body, response_body):
    RESULTS.append(f"Endpoint: {method} {endpoint}\nStatus: {status}\nRequest: {request_body}\nResponse: {response_body}\n---")

# 1. Register User
res = requests.post(f"{BASE_URL}/auth/register", json={"name": "Test", "email": "test@community.com", "password": "pass"})
token = res.json().get('token')
headers = {"Authorization": f"Bearer {token}"}
log("/auth/register", "POST", res.status_code, {"email": "test@community.com"}, res.json())

# 2. GET /api/posts
res = requests.get(f"{BASE_URL}/posts")
log("/posts", "GET", res.status_code, None, res.json())

# 3. POST /api/posts (Auth Required)
res = requests.post(f"{BASE_URL}/posts", json={"title": "Hello"}, headers=headers)
post_id = res.json().get('_id')
log("/posts", "POST", res.status_code, {"title": "Hello"}, res.json())

# 4. GET /api/posts/:id
res = requests.get(f"{BASE_URL}/posts/{post_id}")
log(f"/posts/{post_id}", "GET", res.status_code, None, res.json())

# 5. PUT /api/posts/:id (Auth Required)
res = requests.put(f"{BASE_URL}/posts/{post_id}", json={"title": "Updated"}, headers=headers)
log(f"/posts/{post_id}", "PUT", res.status_code, {"title": "Updated"}, res.json())

# 6. POST /api/posts/:id/like
res = requests.post(f"{BASE_URL}/posts/{post_id}/like", headers=headers)
log(f"/posts/{post_id}/like", "POST", res.status_code, None, res.json())

# 7. POST /api/posts/:id/comment
res = requests.post(f"{BASE_URL}/posts/{post_id}/comment", json={"text": "Nice"}, headers=headers)
log(f"/posts/{post_id}/comment", "POST", res.status_code, {"text": "Nice"}, res.json())

# 8. DELETE /api/posts/:id
res = requests.delete(f"{BASE_URL}/posts/{post_id}", headers=headers)
log(f"/posts/{post_id}", "DELETE", res.status_code, None, res.json())

with open("test_results.txt", "w") as f:
    f.write("\n".join(RESULTS))
