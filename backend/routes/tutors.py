from flask import Blueprint, request, jsonify
import boto3
from .auth import token_required
import os
from botocore.exceptions import ClientError

tutor_bp = Blueprint('tutor', __name__)
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

@tutor_bp.route('/tutor/request/<studentId>/<tutorId>', methods=['POST'])
@token_required
def requestTutor(tutorId, studentId):
    '''POST to request a tutor to accept a student
    Body must contain the following things:
    {
        studentId: str                 # id of student
        tutorId: str                   # id of tutor
    }
    '''
    try:
        users_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))
        response = users_table.get_item(Key={'id': tutorId})
        if 'Item' in response:
            tutor = response['Item']
            current_requests = tutor.get('requests', [])

            # Check if the studentId already exists in requests
            if studentId in current_requests:
                return jsonify({'message': 'Request already exists for this tutor.'}), 400


        users_table.update_item(
            Key={'id': tutorId},
            UpdateExpression="SET requests = list_append(if_not_exists(requests, :empty_list), :studentId)",
            ExpressionAttributeValues={
                ':studentId': [studentId],
                ':empty_list': []
            },
            ReturnValues="UPDATED_NEW"
        )

        return jsonify({'message': 'Tutor request sent successfully!'}), 200

    except ClientError as e:
        return jsonify({
            'error': 'An error occurred while updating tutor requests',
            'details': str(e)
        }), 500

@tutor_bp.route('/tutor/request/response/<studentId>/<tutorId>', methods=['POST'])
@token_required
def tutorResponse(tutorId, studentId):
    '''
    POST for a tutor to accept/decline a student.
    Body must contain:
    {
        "studentId": str,     # ID of the student
        "tutorId": str,       # ID of the tutor
        "response": boolean   # true to accept student, false to reject student
    }
    '''
    try:
        data = request.get_json()
        response = data.get('response')

        users_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))

        # Fetch the tutor's current requests list
        tutor = users_table.get_item(Key={'id': tutorId}).get('Item', {})
        current_requests = tutor.get('requests', [])

        # If studentId is not in requests, return an error
        if studentId not in current_requests:
            return jsonify({'error': 'Student not found in tutor requests'}), 400

        # Determine the index of the student in requests
        student_index = current_requests.index(studentId)

        if response is True:
            # Accept the student
            # Add student to the tutor's students list and remove from requests
            users_table.update_item(
                Key={'id': tutorId},
                UpdateExpression="""
                    SET students = list_append(if_not_exists(students, :empty_list), :studentId)
                    REMOVE requests[{}]
                """.format(student_index),
                ExpressionAttributeValues={
                    ':studentId': [studentId],
                    ':empty_list': []
                },
                ReturnValues="UPDATED_NEW"
            )
            # Add tutor to the student's tutors list
            users_table.update_item(
                Key={'id': studentId},
                UpdateExpression="SET tutors = list_append(if_not_exists(tutors, :empty_list), :tutorId)",
                ExpressionAttributeValues={
                    ':tutorId': [tutorId],
                    ':empty_list': []
                },
                ReturnValues="UPDATED_NEW"
            )

        else:
            # Decline the student by only removing from requests
            users_table.update_item(
                Key={'id': tutorId},
                UpdateExpression="REMOVE requests[{}]".format(student_index),
                ReturnValues="UPDATED_NEW"
            )

        return jsonify({'message': 'Tutor response processed successfully!'}), 200

    except ClientError as e:
        return jsonify({
            'error': 'An error occurred while updating tutor response',
            'details': e.response['Error']['Message']
        }), 500
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500

@tutor_bp.route('/tutor/assign/<tutorId>', methods=['POST'])
@token_required
def tutorAssignSong(tutorId):
    '''POST for a tutor to assign a student(s) a song
    Body must contain the following things:
    {
        students: list[str]            # ids of students to assign a song to
        songId: str                    # id of song being assigned
        tutorId: str                   # id of tutor
    }
    '''
    try:
        # Get the request data
        data = request.get_json()
        students = data.get('students', [])
        songId = data.get('songId')

        # Validate input
        if not students or not songId:
            return jsonify({'error': 'students and songId are required fields'}), 400

        # Assign song to each student
        for studentId in students:
            assign_song_to_student(studentId, songId, tutorId)

        return jsonify({'message': 'Song assigned to students successfully!'}), 200

    except ClientError as e:
        return jsonify({
            'error': 'An error occurred while assigning songs to students',
            'details': str(e)
        }), 500

def assign_song_to_student(studentId: str, songId: str, tutorId: str):
    """
    Helper function to assign a song to a student by adding an entry to the student's 'assigned' array.

    Parameters:
        studentId (str): The ID of the student to whom the song is assigned.
        songId (str): The ID of the song being assigned.
        tutorId (str): The ID of the tutor assigning the song.
    """
    users_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))

    # Define the assignment object
    assignment = {
        'songId': songId,
        'tutorId': tutorId
    }

    # Update the student's 'assigned' array with the new assignment object
    users_table.update_item(
        Key={'id': studentId},
        UpdateExpression="SET assigned = list_append(if_not_exists(assigned, :empty_list), :assignment)",
        ExpressionAttributeValues={
            ':assignment': [assignment],
            ':empty_list': []
        },
        ReturnValues="UPDATED_NEW"
    )