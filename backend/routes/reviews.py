from flask import Blueprint, request, jsonify
import boto3
from .auth import token_required

review_bp = Blueprint('reviews', __name__)
client = boto3.client('cognito-idp', region_name='ap-southeast-2')

@review_bp.route('/review/submit', methods=['POST'])
@token_required
def postExperiementReview():
    '''POST route to submit a lecturers review to a particular experiment
    Route parameters must be of the following format:
    {
        tutor: str               # user id for lecturer
        trackAttemptId: str         # id of the trackAttempt
        feedback: str               # A feedback string
        rating: str                 # A float between 1 and 5 determining closeness to the song
    }

    Returns details of the review ensuring it was successful
    '''
    try:
        data = request.json
        trackAttemptId = data['trackAttemptId']
        feedback = data['feedback']
        rating = data['rating']
        response = client.post_review(
            ClientId=os.getenv('AWS_COGNITO_CLIENTID'),
            Reviewer=userId,
            TrackAttemp=trackAttemptId,
            feedback=feedback
            rating=rating
        )

        reviews = dynamodb.Table(os.getenv('DYNAMODB_TABLE_REVIEWS'))

        review = {
            'id': str(uuid.uuid4()),
            'tutor': userId,
            'trackAttemptId': trackAttemptId,
            'feedback': feedback,
            'rating': rating
        }

        reviews.put_item(Item=review)

        return jsonify({
            'message': 'Review successful!',
            'review_id': response['ReviewId']
        }), 200

@review_bp.route('/review/<trackAttemptId>', methods=['GET'])
@token_required
def getReview(trackAttemptId):
    '''GET route to access the details of a particular users track attempt reviews
    Route parameters must be of the following format:
    {
        trackAttemptId: str                 # id of track attemp we need the review for
    }

    Gets the details of the reviews from dynamodb
    '''

    try:
        reviews = dynamodb.Table(os.getenv('DYNAMODB_TABLE_REVIEWS'))
        response = reviews.get_item(Key={'trackAttemptId': trackAttemptId})

        if 'Item' not in response:
            return jsonify({'error': 'Review not found'}), 404

        review_data = response['Item']

        return jsonify(review_data), 200

    except Exception as e:
        return jsonify({
            'error': 'An error occurred while fetching review details',
            'details': str(e)
        }), 500