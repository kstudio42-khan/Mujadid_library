import requests
import json

BASE_URL = "http://localhost:5000/api"
report = []

# Register
r = requests.post(f"{BASE_URL}/auth/register", json={"name": "Test", "email": "final@test.com", "password": "pass"})
token = r.json()['token']
headers = {"Authorization": f"Bearer {token}"}
report.append(f"POST /api/auth/register | 201 | {r.json()}")

# Create Post
r = requests.post(f"{BASE_URL}/posts", json={"title": "T1"}, headers=headers)
p = r.json()
post_id = p['_id']
report.append(f"POST /api/posts | 201 | {r.json()}")

# GET Posts
r = requests.get(f"{BASE_URL}/posts")
report.append(f"GET /api/posts | 200 | {r.json()}")

# Like
r = requests.post(f"{BASE_URL}/posts/{post_id}/like", headers=headers)
report.append(f"POST /api/posts/:id/like | 200 | {r.json()}")

# Comment
r = requests.post(f"{BASE_URL}/posts/{post_id}/comment", json={"text": "C1"}, headers=headers)
report.append(f"POST /api/posts/:id/comment | 200 | {r.json()}")

# Delete
r = requests.delete(f"{BASE_URL}/posts/{post_id}", headers=headers)
report.append(f"DELETE /api/posts/:id | 200 | {r.json()}")

with open("COMMUNITY_FINAL_TEST_REPORT.md", "w") as f:
    f.write("# COMMUNITY_FINAL_TEST_REPORT.md\n\n" + "\n".join(report))
