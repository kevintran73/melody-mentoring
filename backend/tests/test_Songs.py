import requests
import sys

# ===================================== SETUP =====================================
TOKEN = "Bearer eyJraWQiOiJTbFFRWTM4ZVk0WkY2MU5HamZTTVVpNUQ2UE1DTUE5VFZGT0ZhVGgyM1RVPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxOTNlZTQ3OC03MDAxLTcwMzktMzVjMi1lN2RkZjQyN2Y5ODkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfRnprQ214V2k2IiwiY2xpZW50X2lkIjoiMXRpNDY1ZTNnMWJlZW1zM2N2a2EzOTNxOTIiLCJvcmlnaW5fanRpIjoiNmMxYWUyN2QtM2I4MS00ZDk5LThiZTgtYWRhZTEwYTk2NWZhIiwiZXZlbnRfaWQiOiIwN2M0ZTcyNi04NDYzLTRkNjYtOTgxNy02YmMxZjkzMzE5MjAiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzI5ODM3MTI0LCJleHAiOjE3Mjk4NDA3MjQsImlhdCI6MTcyOTgzNzEyNCwianRpIjoiNTYxYjAzMmUtMzUzNS00MzlhLWE0MzUtMDllZjJjNTU5MTAxIiwidXNlcm5hbWUiOiJkYW1vbnRlc3RpbmcifQ.OohrsufQiOgpMf0w1cbJblnuj062rVXzUuX5remgeXKAocH0Y8KqND_Wxq3TWrpMA53wo_jJcCxVWqlO3FjHE8idSVehLa1C_epEf5d-cP10DZVIhh2zDtnLPWIDd5Xobujmvn15hj_93jczrlhi_HrV0XIcihePEqc1Uzyn_QeqPyTCYmpLEzaztZB-hXQKeuO_ZormRZliFi-NGKPulRJh6Exj9YllP1tPrm1t3tpt1nUJomneLMp4v8ZXsoluxC1VIdkwwhTmhUMecmJr1XhdKkNFtybijTFhsAqMZgiIneDLox4rqlRuhL2_YNNzuzYWQGThhnopsLWv8WgrCQ"
headers = {
    'Authorization': TOKEN
}
res = requests.get('http://192.168.1.101:5001/auth/validate-token', headers=headers)
if res.status_code != 200:
    payload = requests.post(
        'http://192.168.1.101:5001/auth/login',
        headers={
            'email': 'damonlee0497@gmail.com',
            'password': 'Password1!'
        }
    )
    if payload.status_code != 200:
        sys.exit(1)

    headers = {
        'Authorization': 'Bearer ' + payload['access_token']
    }

# ===================================== TESTS =====================================
def test_200_catalogue_list_all_songs():
    url = 'http://192.168.1.101:5001/catalogue/songs/list-all'
    response = requests.get(url, headers=headers)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'

    data = response.json()
    assert isinstance(data, dict)
    assert 'songs' in data
    assert isinstance(data['songs'], list)
    for s in data['songs']:
        assert s['private'] == False

def test_401_catalogue_list_all_songs_no_token():
    url = 'http://192.168.1.101:5001/catalogue/songs/list-all'
    response = requests.get(url)
    assert response.status_code == 401

def test_200_catalogue_find_one_song():
    url = 'http://192.168.1.101:5001/catalogue/songs/list-all'
    searchId = requests.get(url, headers=headers).json()['songs'][0]['id']

    url = f'http://192.168.1.101:5001/catalogue/songs/find/{searchId}'
    response = requests.get(url, headers=headers)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'

    data = response.json()
    assert isinstance(data, dict)
    fields = ['id', 'composer', 'difficulty', 'genreTags', 'instrument', 'private', 'thumbnail', 'title']
    for f in fields:
        assert f in data
