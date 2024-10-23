from pydantic import BaseModel

class S3PresignedURL(BaseModel):
    url: str # "https://bucketName.s3.amazonaws.com/sheetfilekey.pdf?AWSAccessKeyId=notTheNormalAccessKey&Signature=INSERTSIGNATURE&Expires=1728212979"

class Song(BaseModel):
    id: str
    thumbnail: str
    genreTags: list[str]
    instrument: str
    title: str
    difficulty: float       # assigned a float value from [1, 5]

class Upload(BaseModel):
    s3key: str
    title: str

class User(BaseModel):
    id: str # uuid
    username: str
    email: str
    profile_picture: S3PresignedURL
    instrument: str
    miniTestsProgress: list[str]
    history: list[str]
    level: 1
    experimental_upload_videos: list[Upload] # see above
    experimental_upload_audios: list[Upload]
