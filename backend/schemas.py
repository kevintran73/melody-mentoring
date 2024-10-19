from pydantic import BaseModel

class S3PresignedURL(BaseModel):
    signature: str # "7GY4IXOmBA2J1pgK%2Bh3ltU2d1OY%3D",
    url: str # "https://bucketName.s3.amazonaws.com/sheetfilekey.pdf?AWSAccessKeyId=notTheNormalAccessKey&Signature=INSERTSIGNATURE&Expires=1728212979"

class Song(BaseModel):
    id: str
    thumbnail: str
    genreTags: list[str]
    instrument: str
    title: str
    difficulty: float       # assigned a float value from [1, 5]
