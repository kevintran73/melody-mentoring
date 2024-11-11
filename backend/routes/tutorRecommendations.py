from flask import Blueprint, request, jsonify
import boto3
import os
from .auth import token_required
from botocore.exceptions import ClientError
from typing import List, Dict

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')
s3 = boto3.client('s3', region_name='ap-southeast-2')

tutor_recommendationdbp = Blueprint('tutor_recommendation', __name__)

@tutor_recommendationdbp.route('/tutor-recommendations/<userId>', methods=['GET'])
@token_required
def getTutorRecommendations(userId):
    '''GET route to generate tutor recommendations for a specific user
    Route parameters must be of the following format:
    {
        userId: str                 # id of user we need the tutor recommendations for
    }

    Gets the details of the user's tutor recommendations
    Makes sure that the details are being retrieved from the actual user
    '''
    try:
        users = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))

        response = users.get_item(Key={'id': userId})
        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404
        user = response['Item']

        # Scan for tutors with role set to 'tutor'
        tutors_filter = users.scan(
            FilterExpression=Attr('role').eq('tutor')
        )
        tutors = tutors_filter['Items']

        # Pass the user data as the student parameter
        recommendations = generate_recommendations(user, tutors)

        return jsonify(recommendations), 200

    except Exception as e:
        return jsonify({
            'error': 'An error occurred while fetching user details',
            'details': str(e)
        }), 500

# Helper function to generate recommendations
def generate_recommendations(student: Dict, tutors: List[Dict]) -> Dict:
    """
    Generates tutor recommendations for a student based on instrument match, limited to 10 recommendations.

    Parameters:
        student (dict): The student user data.
        tutors (list of dict): The list of tutor data.

    Returns:
        dict: A dictionary containing the list of recommended tutor IDs.
    """
    student_instrument = student.get('instrument')

    # Filter tutors with the same instrument and limit to the first 10 matches
    matched_tutors = [
        tutor['id'] for tutor in tutors if tutor.get('instrument') == student_instrument
    ][:10]  # Limit to the first 10 tutors

    # Return recommendations as a list of matched tutor IDs
    return {"tutors": matched_tutors}
