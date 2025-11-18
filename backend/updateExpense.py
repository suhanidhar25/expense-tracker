import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Expenses')

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
}

def cors_response(status_code=200, body=None):
    body_payload = "" if body is None else json.dumps(body, default=str)
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": body_payload
    }

def convert_decimal(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, dict):
        return {k: convert_decimal(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_decimal(i) for i in obj]
    return obj

def lambda_handler(event, context):
    # Handle preflight
    method = event.get("requestContext", {}).get("http", {}).get("method")
    if method == "OPTIONS":
        return cors_response(200, "")

    body_text = event.get("body") or "{}"
    try:
        body = json.loads(body_text)
    except:
        return cors_response(400, {"error": "Invalid JSON"})

    expense_id = body.get("expenseId")
    if not expense_id:
        return cors_response(400, {"error": "expenseId is required"})

    updatable_fields = ['title', 'amount', 'category', 'date']
    expression_attr_values = {}
    expression_attr_names = {}
    update_expr_parts = []

    for field in updatable_fields:
        if field in body and body[field] is not None:
            value = Decimal(str(body[field])) if field == "amount" else body[field]
            expression_attr_names[f"#{field}"] = field
            expression_attr_values[f":{field}"] = value
            update_expr_parts.append(f"#{field} = :{field}")

    if not update_expr_parts:
        return cors_response(400, {"error": "No fields to update"})

    update_expression = "SET " + ", ".join(update_expr_parts)

    try:
        response = table.update_item(
            Key={'expenseId': expense_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attr_names,
            ExpressionAttributeValues=expression_attr_values,
            ReturnValues="UPDATED_NEW"
        )
        updated_fields = convert_decimal(response.get('Attributes', {}))
        return cors_response(200, {"message": "Expense updated", "updatedFields": updated_fields})
    except Exception as e:
        return cors_response(500, {"error": str(e)})
    
    