import config

cur = config.pymysql.cursors.DictCursor(config.conn)

def get_words(limit):
    cur.execute('select * from dictionary order by (en_score + ko_score) limit {}'.format(limit))
    rows = cur.fetchall()

    def convert(row):
        _dict = {}
        for key, value in row.items():
            _dict[key] = value
        return _dict

    return [convert(row) for row in rows]

def get_field(type):
    EN_QUESTION = 0
    EN_SENTENCE_QUESTION = 1
    KO_QUESTION = 2

    if type == EN_QUESTION: return 'ko_score'
    if type == EN_SENTENCE_QUESTION: return 'en_score'
    if type == KO_QUESTION: return 'en_score'
    return ''

def submit_result(words):
    for word in words:
        query = ''
        id, type, correct, question_mean = word['id'], word['type'], word['correct'], word['question_mean']
        _type = get_field(type)

        question_mean_update_query = ', question_mean = \'{}\''.format(question_mean) if question_mean != None else ''

        if correct:
            query = 'update dictionary set {} = {} + 1{} where id = {}'.format(_type, _type, question_mean_update_query, id)
        else:
            query = 'update dictionary set {} = 0{} where id = {}'.format(_type, question_mean_update_query, id)
        print(query)
        cur.execute(query)
    config.conn.commit()

def append_data(words):
    print(words)
    if len(words) < 0:
        return

    query = "insert into dictionary (english,korean,english_mean,question,question_mean,answer,en_score,ko_score) values "
    items = []

    for word in words:
        items.append("(\"{}\", \"{}\", \"{}\", \"{}\", \"{}\", \"{}\", 0, 0)".format(
            word['english'],
            word['korean'],
            word['english_mean'],
            word['english_question'],
            word['english_question_meaning'],
            word['english_question_answer']
        ))
    query = query + ', '.join(items) + ';'
    print(query)
    cur.execute(query)
    config.conn.commit()
