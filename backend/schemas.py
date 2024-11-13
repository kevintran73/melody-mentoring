from pydantic import BaseModel
from enum import Enum

class Role(str, Enum):
    STUDENT = 'student'
    TUTOR = 'tutor'

class S3PresignedURL(BaseModel):
    url: str # "https://bucketName.s3.amazonaws.com/sheetfilekey.pdf?AWSAccessKeyId=notTheNormalAccessKey&Signature=INSERTSIGNATURE&Expires=1728212979"

class Playlist(BaseModel):
    id: str
    thumbnail: str
    genreTags: list[str]
    title: str
    private: bool

class Song(BaseModel):
    id: str
    thumbnail: str
    genreTags: list[str]
    instrument: str
    title: str
    difficulty: str             # but internally treated as a float, assigned from [1, 5] (easy -> hard)
    private: bool
    # trackAudio: str           # trackAudio s3 key is just this objects id in s3->track-audio
    uploaderId: str             # id of the person who uploaded, "None" would be melody mentoring, the default
    composer: str               # name of the composer

class Achievement(BaseModel):
    name: str 
    easy_required: int
    medium_required: int
    hard_required: int
    achieved: bool

class User(BaseModel):
    id: str                     # uuid
    username: str
    email: str
    profile_picture: S3PresignedURL
    instrument: str
    achievements: list[Achievement]
    track_attempts: list[str]   # corresponding trackattemptid, oldest first
    private_songs: list[str]
    favourite_songs: list[str]
    last_login: str             # time of last login
    current_streak: int         # streak of logins
    easy_completed: list[str]   # SongIds for completed tracks
    medium_completed: list[str] # SongIds for completed tracks
    hard_completed: list[str]   # SongIds for completed tracks
    students: list[str] # list of students a tutor marks
    tutors: list[str] # list of tutors
    requests: list[str] # list of students requesting to become a tutors student
    assigned: list[str] # list of songs that are assigned to a student
    to_review: list[str] # list of track attemps a tutor needs to review
    role: Role

class Review(BaseModel):
    id: str
    tutor: str                    # user id for tutor
    trackAttemptId: str
    feedback: str                 # A feedback string
    rating: str                   # A float between 1 and 5 determining closeness to the song

class TrackAttempt(BaseModel):
    id: str
    userId: str
    songId: str
    # sheetKey: str               # music sheet s3 key is this object's id in s3->track-sheets
    # audioKey: str               # audio s3 key is this object's id in s3->user-experiment-audio
    # videoKey: str               # video s3 key is this object's id in s3->user-experiment-video
    isoUploadTime: str            # time of upload
    reviews: list[str]            # id of reviews

class Recommendations(BaseModel):
    tutors: list[str]