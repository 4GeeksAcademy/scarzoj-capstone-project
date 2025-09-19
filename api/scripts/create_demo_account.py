import requests

API_URL = "http://localhost:5000/register"


def create_demo_account():
    payload = {"user_name": "demo", "email": "demo@example.com", "password": "demo"}
    response = requests.post(API_URL, json=payload)
    if response.status_code == 201:
        print("Demo account created successfully.")
    else:
        print(f"Failed to create demo account: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    create_demo_account()
