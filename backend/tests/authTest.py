import unittest
import requests

class APITestCase(unittest.TestCase):

    BASE_URL = 'http://localhost:5001'

    def test_signup_missing_fields(self):
        payload = {
            "username": "testinguser",
            "password": "Password!0"
        }
        response = requests.post(f'{self.BASE_URL}/auth/signup', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_signup_already_registered(self):
        payload = {
            "username": "testinguser",
            "gmail": "testmelody7@gmail.com",
            "password": "Password!0"
        }

        response = requests.post(f'{self.BASE_URL}/auth/signup', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_login_success(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }

        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
    
    def test_login_incorrect_credentials(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "dsadas"
        }

        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
    
    def test_login_missing_fields(self):
        payload = {
            "password": "dsadas"
        }

        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
    
    def test_logout_success(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }

        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)

        access_token = response.json()['access_token']
        payload = {
            "access_token": access_token
        }

        response = requests.post(f'{self.BASE_URL}/auth/logout', json=payload)
        self.assertEqual(response.status_code, 200)
    
    def test_logout_missing_fields(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }

        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)

        payload = {
        }

        response = requests.post(f'{self.BASE_URL}/auth/logout', json=payload)
        self.assertEqual(response.status_code, 400)
    
    def test_logout_success(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }

        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)

        access_token = 'dsadasda'
        payload = {
            "access_token": access_token
        }

        response = requests.post(f'{self.BASE_URL}/auth/logout', json=payload)
        self.assertEqual(response.status_code, 400)

   
if __name__ == '__main__':
    unittest.main()
