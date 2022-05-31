from flask import Flask, request, jsonify, make_response

app = Flask(__name__)

@app.route('/', methods=['POST', 'OPTIONS'])
def json_example():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        response.headers.add("Access-Control-Allow-Credentials", "*")
        return response
    request_data = request.get_json()
    print(request_data)
    response = make_response(jsonify(
        username='hello',
        name='wut?',
    ), 200)
    response.headers.add('Access-Control-Allow-Origin', "*")
    return response
