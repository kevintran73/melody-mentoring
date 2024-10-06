from flask import Flask, jsonify
from s3_bucket_helpers import urlFromBucketObj

from dotenv import load_dotenv
import os
load_dotenv()
bucket_name = os.getenv('BUCKET_NAME')

app = Flask(__name__)

@app.route('/test', methods=["GET"])
def test():
    return {'hey': 'you made a GET request!'}

# TODO fix: currently the only pdf in here is test-pdf
@app.route('/catalogue/<string:filename>', methods=["GET"])
def get_file_pdf(filename):
    '''GET route for retrieving a link to the pdf

    AWS s3's presigned link contains special chars like %2F inside their signature
    This means that the URL will get encoded when this API is called.
    To get around this, this API now returns an object with two fields, 'url' and 'signature'
    e.g.
    GET /catalogue/afilename ...
    {
        "signature": "7GY4IXOmBA2J1pgK%2Bh3ltU2d1OY%3D",
        "url": "https://bucketName.s3.amazonaws.com/afilename.pdf?AWSAccessKeyId=notTheNormalAccessKey&Signature=INSERTSIGNATURE&Expires=1728212979"
    }
    To retrieve the link you have to piece it back together (replace 'INSERTSIGNATURE' with res.signature)
    '''

    url = urlFromBucketObj(bucket_name, filename + '.pdf')
    if url is not None:
        return jsonify({'url': url[0], 'signature': url[1]})
    else:
        return 'error: check the file name', 404

if __name__ == '__main__':
    app.run(debug=True)
