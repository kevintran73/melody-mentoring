from flask import Blueprint, request, jsonify
import boto3
from .auth import token_required

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
def tutorResponse(tutorId):
     '''POST for a tutor to accept/decline a student
    Body must contain the following things:
    {
        studentId: str                 # id of student
        tutorId: str                   # id of tutor
        resposne: boolean              # true to accept student, false to reject student
    }
    '''
    try:
        data = request.get_json()
        response = data.get('response')

        users_table = dynamodb.Table(os.getenv('DYNAMODB_TABLE_USERS'))

        # If response is true, add student to 'students' and remove from 'requests'
        if response is True:
            # Add student to tutors students list
            users_table.update_item(
                Key={'id': tutorId},
                UpdateExpression="""
                    SET students = list_append(if_not_exists(students, :empty_list), :studentId)
                    REMOVE requests[requests.index(:studentId)]
                """,
                ExpressionAttributeValues={
                    ':studentId': [studentId],
                    ':empty_list': []ß
                },
                ReturnValues="UPDATED_NEW"
            )
             # Add tutor to the student's tutors list
            users_table.update_item(
                Key={'id': student_id},
                UpdateExpression="SET tutors = list_append(if_not_exists(tutors, :empty_list), :tutorId)",
                ExpressionAttributeValues={
                    ':tutorId': [tutorId],
                    ':empty_list': []
                },
                ReturnValues="UPDATED_NEW"
            )
        # If response is false, only remove the studentId from 'requests'
        else:
            users_table.update_item(
                Key={'id': tutorId},
                UpdateExpression="REMOVE requests[requests.index(:studentId)]",
                ExpressionAttributeValues={
                    ':studentId': studentId
                },
                ReturnValues="UPDATED_NEW"
            )

        return jsonify({'message': 'Tutor response processed successfully!'}), 200

    except ClientError as e:
        return jsonify({
            'error': 'An error occurred while updating tutor response',
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