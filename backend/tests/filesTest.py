import unittest
import requests

class APITestCase(unittest.TestCase):

    BASE_URL = 'http://localhost:5001'

    def test_get_track_sheet_success(self):
        songId = "testingSong"  
    
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

        response = requests.get(f'{self.BASE_URL}/files/sheets/{songId}', headers=headers)
        
        self.assertEqual(response.status_code, 200)
        
        self.assertIn('url', response.json())
        
        presigned_url = response.json()['url']
        presigned_response = requests.get(presigned_url)
        self.assertEqual(presigned_response.status_code, 200)
    
    def test_get_invalid_track_sheet(self):
        songId = "dsada"  
    
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

        response = requests.get(f'{self.BASE_URL}/files/sheets/{songId}', headers=headers)
        
        self.assertEqual(response.status_code, 404)
        
        self.assertIn('error', response.json())
    
    def test_get_track_attempt_audio_success(self):
        trackAttemptId = "testingTrackAttempt"  
    
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

        response = requests.get(f'{self.BASE_URL}/files/user/audio/{trackAttemptId}', headers=headers)
        
        self.assertEqual(response.status_code, 200)
        
        self.assertIn('url', response.json())
        
        presigned_url = response.json()['url']
        presigned_response = requests.get(presigned_url)
        self.assertEqual(presigned_response.status_code, 200)
    
    def test_get_invalid_track_attempt_audio(self):
        trackAttemptId = "dsaddsa" 
    
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

        response = requests.get(f'{self.BASE_URL}/files/user/audio/{trackAttemptId}', headers=headers)
        
        self.assertEqual(response.status_code, 404)
        
        self.assertIn('error', response.json())
    
    def test_create_private_song_success(self):
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

        payload = {
            "userId": "f0ae800c-7607-4468-a3cf-7ca9550b7b5b",
            "composer": "Beethoven",
            "thumbnail": "",
            "genreTags": ["classical"],
            "instrument": "piano",
            "title": "Ode to Joy",
            "difficulty": 2
        }

        response = requests.post(f'{self.BASE_URL}/files/user/create-private-song', json=payload, headers=headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('audioUploader', response.json())
        self.assertIn('sheetUploader', response.json())
    
    def test_create_private_song_missing_fields(self):
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

        payload = {
            "composer": "Beethoven",
            "thumbnail": "",
            "genreTags": ["classical"],
            "instrument": "piano",
            "title": "Ode to Joy",
            "difficulty": 2
        }

        response = requests.post(f'{self.BASE_URL}/files/user/create-private-song', json=payload, headers=headers)
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
    
    def test_new_track_attempt_success(self):
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

        payload = {
            "userId": "f0ae800c-7607-4468-a3cf-7ca9550b7b5b",
            "songId": "testingSong"
        }

        response = requests.post(f'{self.BASE_URL}/files/user/new-track-attempt', json=payload, headers=headers)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('audioUploader', response.json())
        self.assertIn('videoUploader', response.json())
    
    def test_new_track_attempt_missing_fields(self):
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

        payload = {
            "songId": "testingSong"
        }

        response = requests.post(f'{self.BASE_URL}/files/user/new-track-attempt', json=payload, headers=headers)
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    
    

if __name__ == '__main__':
    unittest.main()