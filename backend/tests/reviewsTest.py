import unittest
import requests

class APITestCase(unittest.TestCase):

    BASE_URL = 'http://localhost:5001'

    def setUp(self):
        # Login as a tutor to get a valid token
        tutor_login_payload = {
            "email": "testingtutors@yopmail.com",
            "password": "Thisisthepassword!123"
        }
        tutor_response = requests.post(f'{self.BASE_URL}/auth/login', json=tutor_login_payload)
        self.assertEqual(tutor_response.status_code, 200)
        self.tutor_token = tutor_response.json().get('access_token')
        self.tutor_headers = {'Authorization': f'Bearer {self.tutor_token}'}

        # Login as a student to get a valid token
        student_login_payload = {
            "email": "testmelody7@gmail.com",
            "password": "Password!0"
        }
        student_response = requests.post(f'{self.BASE_URL}/auth/login', json=student_login_payload)
        self.assertEqual(student_response.status_code, 200)
        self.student_token = student_response.json().get('access_token')
        self.student_headers = {'Authorization': f'Bearer {self.student_token}'}

    def test_requesting_review_correctly(self):
        payload = {
            "tutor": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28",
            "trackAttemptId": "5f50286-60f7-4fdd-a658-926a8ad386e2",
            "studentId": "f0ae800c-7607-4468-a3cf-7ca9550b7b"
        }
        response = requests.post(
            f'{self.BASE_URL}/review/request',
            headers=self.student_headers,
            json=payload
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], "Request to review has been submitted successfully")

    def test_requesting_review_with_missing_details(self):
        payload = {
            "tutor": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28",
            # Missing trackAttemptId and studentId
        }
        response = requests.post(
            f'{self.BASE_URL}/review/request',
            headers=self.student_headers,
            json=payload
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], "Missing required fields")

    def test_posting_experiment_review_incorrectly(self):
        payload = {
            "tutor": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28",
            # Missing trackAttemptId, feedback, and rating
        }
        response = requests.post(
            f'{self.BASE_URL}/review/submit',
            headers=self.tutor_headers,
            json=payload
        )
        self.assertEqual(response.status_code, 500)
        self.assertIn('error', response.json())

if __name__ == '__main__':
    unittest.main()
