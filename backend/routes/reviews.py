from flask import Blueprint, request, jsonify
import boto3
import os
from .auth import token_required
import uuid
from botocore.exceptions import ClientError

review_bp = Blueprint('reviews', __name__)
client = boto3.client('cognito-idp', region_name='ap-southeast-2')
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

@review_bp.route('/review/request', methods=['POST'])
@token_required
def requestExperimentReview():
    '''POST route to submit a students request to review a particular experiment
    Route parameters must be of the following format:
    {
        tutor: str                  # user id for tutor
        trackAttemptId: str         # id of the trackAttempt
    }

    Returns details of the review ensuring it was successful
    '''
    try:
        data = request.get_json()
        tutor_id = data.get("tutor")
        track_attempt_id = data.get("trackAttemptId")
        student_id = data.get("studentId")

        if not tutor_id or not track_attempt_id or not student_id:
            return jsonify({"error": "Missing required fields"}), 400

        users_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))

        # Update the tutor's to_review list by adding the new trackAttemptId
        response = users_table.update_item(
            Key={'id': tutor_id},
            UpdateExpression="SET to_review = list_append(if_not_exists(to_review, :empty_list), :track_attempt)",
            ExpressionAttributeValues={
                ':track_attempt': [track_attempt_id],
                ':empty_list': []
            },
            ReturnValues="UPDATED_NEW"
        )

        return jsonify({
            "message": "Request to review has been submitted successfully",
            "updated_to_review": response['Attributes'].get('to_review', [])
        }), 200

    except ClientError as e:
        return jsonify({
            "error": "An error occurred while updating the tutor's to_review list",
            "details": e.response['Error']['Message']
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred",
            "details": str(e)
        }), 500

@review_bp.route('/review/submit', methods=['POST'])
@token_required
def postExperimentReview():
    '''
    POST route to submit a tutor's review of a particular experiment.
    Route parameters must be of the following format:
    {
        "tutor": str,               # user id for the tutor
        "trackAttemptId": str,      # id of the trackAttempt
        "feedback": str,            # A feedback string
        "rating": float             # A float between 1 and 5 determining closeness to the song
    }

    Returns details of the review, ensuring it was successful.
    '''
    try:
        data = request.json
        tutor_id = data['tutor']
        track_attempt_id = data['trackAttemptId']
        feedback = data['feedback']
        rating = data['rating']

        # Access the DynamoDB tables
        reviews_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_REVIEWS'))
        track_attempts_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_TRACK_ATTEMPTS'))
        users_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))

        # Create and save the review in the reviews table
        review_id = str(uuid.uuid4())
        review = {
            'id': review_id,
            'tutor': tutor_id,
            'trackAttemptId': track_attempt_id,
            'feedback': feedback,
            'rating': rating
        }
        reviews_table.put_item(Item=review)

        # Append the review ID to the reviews list in the trackAttempt entry
        track_attempts_table.update_item(
            Key={'id': track_attempt_id},
            UpdateExpression="SET reviews = list_append(if_not_exists(reviews, :empty_list), :new_review)",
            ExpressionAttributeValues={
                ':new_review': [review_id],
                ':empty_list': []
            },
            ReturnValues="UPDATED_NEW"
        )

        # Remove the trackAttemptId from the tutor's to_review list
        users_table.update_item(
            Key={'id': tutor_id},
            UpdateExpression="SET to_review = list_remove(to_review, :index)",
            ConditionExpression="contains(to_review, :track_attempt)",
            ExpressionAttributeValues={
                ':track_attempt': track_attempt_id
            },
            ReturnValues="UPDATED_NEW"
        )

        return jsonify({
            'message': 'Review submitted successfully!',
            'review': review
        }), 200

    except ClientError as e:
        return jsonify({
            "error": "An error occurred while submitting the review",
            "details": e.response['Error']['Message']
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred",
            "details": str(e)
        }), 500

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
        reviews_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_REVIEWS'))
        response = reviews_table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('trackAttemptId').eq(trackAttemptId)
        )

        if 'Items' not in response or not response['Items']:
            return jsonify({'error': 'No reviews found for the specified track attempt'}), 404

        return jsonify({'reviews': response['Items']}), 200

    except Exception as e:
        return jsonify({
            'error': 'An error occurred while fetching review details',
            'details': str(e)
        }), 500