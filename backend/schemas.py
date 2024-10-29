from pydantic import BaseModel

class S3PresignedURL(BaseModel):
    url: str # "https://bucketName.s3.amazonaws.com/sheetfilekey.pdf?AWSAccessKeyId=notTheNormalAccessKey&Signature=INSERTSIGNATURE&Expires=1728212979"

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

class User(BaseModel):
    id: str                     # uuid
    username: str
    email: str
    profile_picture: S3PresignedURL
    instrument: str
    miniTestsProgress: list[str]
    level: 1
    track_attempts: list[str]   # corresponding trackattemptid, oldest first
    private_songs: list[str]

class Review(BaseModel):
    pass
    # TODO

class TrackAttempt(BaseModel):
    id: str
    userId: str
    songId: str
    # sheetKey: str               # music sheet s3 key is this object's id in s3->track-sheets
    # audioKey: str               # audio s3 key is this object's id in s3->user-experiment-audio
    # videoKey: str               # video s3 key is this object's id in s3->user-experiment-video
    isoUploadTime: str            # time of upload
    reviews: list[Review]
