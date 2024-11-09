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
    '''GET route to access the details of a particular user
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
        tutors_filter = users.scan(
            FilterExpression=Attr('role').eq('tutor')
        )
        tutors = tutors_filter['Items']
        recommendations = generate_recommendations(student, tutors)

        return jsonify(recommendations), 200

    except Exception as e:
        return jsonify({
            'error': 'An error occurred while fetching user details',
            'details': str(e)
        }), 500

# Make a function that takes in a student and tutors and finds tutors with the same instruments that matches it and puts it in an array

def generate_recommendations(student: Dict, tutors: List[Dict]) -> Dict:
    """
    Generates tutor recommendations for a student based on instrument match.

    Parameters:
        student (dict): The student user data.
        tutors (list of dict): The list of tutor data.

    Returns:
        dict: A dictionary containing the list of recommended tutor IDs.
    """
    student_instrument = student.get('instrument')

    # Filter tutors with the same instrument
    matched_tutors = [
        tutor['id'] for tutor in tutors if tutor.get('instrument') == student_instrument
    ]

    # Return recommendations as a list of matched tutor IDs
    return {"tutors": matched_tutors}