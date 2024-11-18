import unittest
import requests


class APITestCase(unittest.TestCase):

    BASE_URL = 'http://localhost:5001'

    def test_feedback_for_track_attempt(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }
        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        token = response.json()['access_token']

        headers = {
            'Authorization': f'Bearer {token}'
        }

        trackAttemptId = '49c4c7af-a8e8-4f2a-8cb3-d967cff8d67a'
        response = requests.get(f'{self.BASE_URL}/attempts/user/feedback-for-attempt/{trackAttemptId}', headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn("pitch", response.json())
    
    def test_feedback_for_track_attempt_invalid_id(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }
        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        token = response.json()['access_token']

        headers = {
            'Authorization': f'Bearer {token}'
        }

        trackAttemptId = 'dsadasd'
        response = requests.get(f'{self.BASE_URL}/attempts/user/feedback-for-attempt/{trackAttemptId}', headers=headers)

        self.assertEqual(response.status_code, 404)

    def test_feedback_for_track_attempt_unrecognised_model(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }
        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        token = response.json()['access_token']

        headers = {
            'Authorization': f'Bearer {token}'
        }

        trackAttemptId = '49c4c7af-a8e8-4f2a-8cb3-d967cff8d67a'

        payload= {
            "model": 'invalid'
        }
        response = requests.get(f'{self.BASE_URL}/attempts/user/feedback-for-attempt/{trackAttemptId}', params=payload, headers=headers)

        self.assertEqual(response.status_code, 400)
    
    def test_track_attempt_details(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }
        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        token = response.json()['access_token']

        headers = {
            'Authorization': f'Bearer {token}'
        }

        trackAttemptId = '49c4c7af-a8e8-4f2a-8cb3-d967cff8d67a'

        response = requests.get(f'{self.BASE_URL}/track-attempt/{trackAttemptId}', headers=headers)

        self.assertEqual(response.status_code, 200)
    
    def test_track_attempt_details_invalid_id(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }
        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        token = response.json()['access_token']

        headers = {
            'Authorization': f'Bearer {token}'
        }

        trackAttemptId = 'dsadasda'

        response = requests.get(f'{self.BASE_URL}/track-attempt/{trackAttemptId}', headers=headers)

        self.assertEqual(response.status_code, 404)
    
    def test_user_history(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }
        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        token = response.json()['access_token']

        headers = {
            'Authorization': f'Bearer {token}'
        }

        userId = 'f0ae800c-7607-4468-a3cf-7ca9550b7b5b'

        response = requests.get(f'{self.BASE_URL}/track-attempt/history/{userId}', headers=headers)

        self.assertEqual(response.status_code, 200)
    
    def test_user_history_invalid_id(self):
        payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }
        response = requests.post(f'{self.BASE_URL}/auth/login', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json())
        token = response.json()['access_token']

        headers = {
            'Authorization': f'Bearer {token}'
        }

        userId = 'dsadasd'

        response = requests.get(f'{self.BASE_URL}/track-attempt/history/{userId}', headers=headers)

        self.assertEqual(response.status_code, 404)
    

if __name__ == '__main__':
    unittest.main()