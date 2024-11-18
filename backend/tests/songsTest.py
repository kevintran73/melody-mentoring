import unittest
import requests


class APITestCase(unittest.TestCase):

    BASE_URL = 'http://localhost:5001'

    def test_song_details(self):
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

        songId = 'testingSong'
        response = requests.get(f'{self.BASE_URL}/catalogue/songs/find/{songId}', headers=headers)

        self.assertEqual(response.status_code, 200)
    
    def test_song_details_invalid_id(self):
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

        songId = 'dasdas'
        response = requests.get(f'{self.BASE_URL}/catalogue/songs/find/{songId}', headers=headers)

        self.assertEqual(response.status_code, 404)
    
    def test_song_get_catalogue(self):
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
        response = requests.get(f'{self.BASE_URL}/catalogue/user-catalogue/{userId}', headers=headers)

        self.assertEqual(response.status_code, 200)

    def test_song_get_catalogue_invalid_id(self):
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

        userId = 'dasdas'
        response = requests.get(f'{self.BASE_URL}/catalogue/user-catalogue/{userId}', headers=headers)

        self.assertEqual(response.status_code, 404)
    
    def test_song_query(self):
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
            "query": 'a'
        }

        response = requests.get(f'{self.BASE_URL}/catalogue/query', params=payload, headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn('songs', response.json())
    
    def test_song_pagination(self):
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
            "query": 'a'
        }

        response = requests.get(f'{self.BASE_URL}/catalogue/query', params=payload, headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn('songs', response.json())
        first = response.json()['songs']

        payload = {
            "query": 'a',
            "last_key": response.json()['last_key']
        }

        response = requests.get(f'{self.BASE_URL}/catalogue/query', params=payload, headers=headers)

        self.assertEqual(response.status_code, 200)
        self.assertIn('songs', response.json())

        self.assertNotEqual(first, response.json()['songs'])
    
    def test_song_query_missing_query(self):
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

        payload = {}

        response = requests.get(f'{self.BASE_URL}/catalogue/query', params=payload, headers=headers)

        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':
    unittest.main()