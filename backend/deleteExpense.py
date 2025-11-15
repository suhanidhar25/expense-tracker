import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Expenses')

def lambda_handler(event, context):
    body_text = event.get('body') or '{}'
    try:
        body = json.loads(body_text)
    except:
        body = {}

    expense_id = body.get('expenseId')
    if not expense_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing expenseId'})
        }

    # Delete the item using the partition key
    response = table.delete_item(
        Key={
            'expenseId': expense_id
        }
    )

    return {
        'statusCode': 200,
        'body': json.dumps({'message': f'Expense {expense_id} deleted successfully'})
    }