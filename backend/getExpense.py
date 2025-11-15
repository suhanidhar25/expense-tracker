import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Expenses')

# helper function to convert Decimal → float
def decimal_to_float(obj):
    if isinstance(obj, list):
        return [decimal_to_float(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: decimal_to_float(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    else:
        return obj

def lambda_handler(event, context):
    user_id = 'demo'  # static for now

    response = table.scan(
        FilterExpression=Key('userId').eq(user_id)
    )

    items = response.get('Items', [])
    # convert Decimals to float before returning
    clean_items = decimal_to_float(items)

    return {
        'statusCode': 200,
        'body': json.dumps({'expenses': clean_items})
    }