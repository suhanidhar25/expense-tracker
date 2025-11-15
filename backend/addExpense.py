import json
import uuid
import boto3
from datetime import datetime
from decimal import Decimal   # ✅ new import

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Expenses')   # DynamoDB table name

def lambda_handler(event, context):
    # Parse body from event
    body_text = event.get('body') or '{}'
    try:
        body = json.loads(body_text)
    except:
        body = {}

    # Required fields
    category = body.get('category')
    amount = body.get('amount')
    if not category or not amount:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing category or amount"})
        }

    expense_id = str(uuid.uuid4())

    # ✅ Convert amount to Decimal (NOT float)
    item = {
        'userId': 'demo',
        'expenseId': expense_id,
        'amount': Decimal(str(amount)),  # <---- FIXED HERE
        'category': category,
        'date': body.get('date') or datetime.utcnow().isoformat(),
        'notes': body.get('notes', '')
    }

    table.put_item(Item=item)

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Expense added successfully', 'expense': item}, default=str)
    }