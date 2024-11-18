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

    def test_student_requests_tutor(self):
        payload = {
            "studentId": "f0ae800c-7607-4468-a3cf-7ca9550b7b",
            "tutorId": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28"
        }
        response = requests.post(
            f'{self.BASE_URL}/tutor/request/f0ae800c-7607-4468-a3cf-7ca9550b7b/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.student_headers,
            json=payload
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], 'Tutor request sent successfully!')

    def test_tutor_rejects_student(self):
        req_payload = {
            "studentId": "f0ae800c-7607-4468-a3cf-7ca9550b7b",
            "tutorId": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28"
        }
        response = requests.post(
            f'{self.BASE_URL}/tutor/request/f0ae800c-7607-4468-a3cf-7ca9550b7b/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.student_headers,
            json=req_payload
        )

        payload = {
            "studentId": "f0ae800c-7607-4468-a3cf-7ca9550b7b",
            "tutorId": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28",
            "response": False
        }
        response = requests.post(
            f'{self.BASE_URL}/tutor/request/response/f0ae800c-7607-4468-a3cf-7ca9550b7b/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.tutor_headers,
            json=payload
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())

    def test_tutor_accepts_student(self):
        req_payload = {
            "studentId": "f0ae800c-7607-4468-a3cf-7ca9550b7b",
            "tutorId": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28"
        }
        response = requests.post(
            f'{self.BASE_URL}/tutor/request/f0ae800c-7607-4468-a3cf-7ca9550b7b/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.student_headers,
            json=req_payload
        )

        payload = {
            "studentId": "f0ae800c-7607-4468-a3cf-7ca9550b7b",
            "tutorId": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28",
            "response": True
        }
        response = requests.post(
            f'{self.BASE_URL}/tutor/request/response/f0ae800c-7607-4468-a3cf-7ca9550b7b/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.tutor_headers,
            json=payload
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())

    def test_tutor_assigns_student_song(self):
        payload = {
            "students": ["f0ae800c-7607-4468-a3cf-7ca9550b7b5b"],
            "songId": "song789"
        }
        response = requests.post(
            f'{self.BASE_URL}/tutor/assign/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.tutor_headers,
            json=payload
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())

    def test_tutor_assigns_student_song_with_missing_details(self):
        payload = {
            "students": []
        }
        response = requests.post(
            f'{self.BASE_URL}/tutor/assign/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.tutor_headers,
            json=payload
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_student_requests_tutor_with_missing_details(self):
        response = requests.post(
            f'{self.BASE_URL}/tutor/request/f0ae800c-7607-4468-a3cf-7ca9550b7b5b/',
            headers=self.student_headers
        )
        self.assertEqual(response.status_code, 404)

    def test_student_sends_duplicate_request(self):
        payload = {
            "studentId": "f0ae800c-7607-4468-a3cf-7ca9550b7b5b",
            "tutorId": "f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28"
        }

        requests.post(
            f'{self.BASE_URL}/tutor/request/f0ae800c-7607-4468-a3cf-7ca9550b7b/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.student_headers,
            json=payload
        )

        second_request = requests.post(
            f'{self.BASE_URL}/tutor/request/f0ae800c-7607-4468-a3cf-7ca9550b7b/f27adc90-f93f-4a02-9ee3-ad2ba7f9aa28',
            headers=self.student_headers,
            json=payload
        )
        self.assertEqual(second_request.status_code, 400)
        self.assertIn('message', second_request.json())
        self.assertEqual(second_request.json()['message'], 'Request already exists for this tutor.')

if __name__ == '__main__':
    unittest.main()
