import json
import database

from flask import Flask, Response, request
from flask_cors import CORS

from google.cloud import translate

def translate_text(texts, project_id="pivotal-tower-285609"):
    client = translate.TranslationServiceClient()
    location = "global"
    parent = f"projects/{project_id}/locations/{location}"
    response = client.translate_text(
        request={
            "parent": parent,
            "contents": texts,
            "mime_type": "text/plain",
            "source_language_code": "en-US",
            "target_language_code": "ko-KR",
        }
    )
    return [translation.translated_text for translation in response.translations]

app = Flask(__name__)
CORS(app)

app.config['JSON_AS_ASCII'] = False

@app.route('/english_words')
def get_english_words():
    en_dict = database.get_words(50)
    print('word len={}'.format(len(en_dict)))
    result = json.dumps(en_dict, ensure_ascii=False, indent=4)
    return Response(result, mimetype='application/json', status=200)

@app.route('/question_means')
def get_question_means():
    parameter = request.args.getlist('data[]')
    translated_text = translate_text(parameter)
    print('translated_text = {}'.format(translated_text))
    response = json.dumps(translated_text, ensure_ascii=False, indent=4)
    return Response(response, mimetype='application/json', status=200)

@app.route('/english_words', methods=['POST'])
def add_new_word():
    new_words = json.loads(request.get_data())
    database.append_data(new_words)
    return Response({'message': 'success'}, mimetype='application/json', status=200)

@app.route('/apply_result', methods=['POST'])
def apply_exam_result():
    word_results = json.loads(request.get_data())
    database.submit_result(word_results)
    return Response({'message': 'success'}, mimetype='application/json', status=200)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
