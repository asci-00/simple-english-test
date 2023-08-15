const EN_QUESTION = 0;
const EN_SENTENCE_QESTION = 1;
const KO_QUESTION = 2;

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

const changeBoxBackground = (word, _block, correct) => {
  word.correct = correct;
  _block.classList.remove('correct');
  _block.classList.remove('wrong');

  if (correct) _block.classList.add('correct');
  else _block.classList.add('wrong');
}

const isCorrectAnswer = (word, input) => {
  const correctAnswer = getCorrectAnswer(word);
  console.log(`[isCorrectAnswer] ${word.type} ${correctAnswer} ${input}`);
  if (word.type === EN_QUESTION) return input && correctAnswer.includes(input);
  else return correctAnswer === input;
} 

const getCorrectAnswer = ({type, answer, english, korean}) => {
  switch(type) {
    case EN_SENTENCE_QESTION:   return answer.trim();
    case KO_QUESTION:           return english.trim();
    case EN_QUESTION:           return korean.trim();
    default:                    return false;
  }
}

const getQuestion = ({type, english, korean, question}) => {
  switch(type) {
    case EN_SENTENCE_QESTION: return question;
    case KO_QUESTION:         return korean;
    case EN_QUESTION:         return english;
    default:                  return '';
  }
}

const getWordCheckFunction = (word, index) => (ev) => {
  if (ev && ev.type === 'keydown' && !(ev.key === 'Enter')) return;

  const _block = document.querySelector(`[data-index='${index}']`);
  const _correct_answer = _block.querySelector('.correct-answer');
  const _answer = _block.querySelector('.answer');

  const input_answer = _answer.value.trim();

  if (ev === true) {
    _answer.disabled = true;
    _correct_answer.style.width = '100px';
    _correct_answer.innerText = getCorrectAnswer(word);
  }

  const res = isCorrectAnswer(word, input_answer);
  console.log(res);
  changeBoxBackground(word, _block, res);

  return res ? 1 : 0;
}

const allCheckCallback = (words) => {
  submit.disabled = false;

  return words
    .map(getWordCheckFunction)
    .map(callback => callback(true))
    .reduce((acc, curr) => acc += curr, 0);
}

const submitCallback = (words, message) => {
  axios.post('http://127.0.0.1:5000/apply_result', words.map(word => ({
    id: word.id,
    type: word.type,
    correct: word.correct,
    question_mean: word.question_mean,
  }))).then(() => {
    const _popup = document.createElement('div');
    const _content = document.createElement('div');

    _popup.className = 'popup';
    _content.innerHTML = `${message}\n제출되었습니다.`;
    _popup.appendChild(_content);
    app.appendChild(_popup);
  });
}

async function App() {
  console.log('[App] running');
  const word_list = (await axios.get('http://127.0.0.1:5000/english_words')).data.map(word => (
    {
      ...word,
      correct: false,
      type: getRandomItem([
        KO_QUESTION, 
        EN_QUESTION, 
        ...(word.question && word.question !== '%s' ? [EN_SENTENCE_QESTION] : [])
      ])
    }
  ));
  console.log(`[App-get-api] ${word_list}`);
  
  let correctCount = 0;

  submit.addEventListener('click', () => submitCallback(word_list, `${correctCount}/${word_list.length}`));
  allCheck.addEventListener('click', () => { correctCount = allCheckCallback(word_list); });

  const question_mean_request_target = word_list
    .filter(({type, question_mean}) => type === EN_SENTENCE_QESTION && question_mean === null)
    .map(({question, answer, id}) => ({
      id,
      string: question.replace('%s', answer),
    }));

  console.log(`[App-get-mean-api] ${question_mean_request_target}`)

  await axios('http://127.0.0.1:5000/question_means',
    { params: { data: question_mean_request_target.map(({string}) => string) } },
  ).then(({data: question_means}) => {
    console.log(question_means);

    question_mean_request_target.forEach(({id}, idx) => {
      const target_word = word_list.find(({id: _id}) => id === _id);
      target_word.question_mean = question_means[idx];
    });
  })

  word_list.forEach((word, idx) => {
    const _block = document.createElement('div');
    const _question = document.createElement('div');
    const _answer = document.createElement('input');
    const _check = document.createElement('button');
    const _correct = document.createElement('button');
    const _wrong = document.createElement('button');
    const _correct_answer = document.createElement('div');

    _block.className = 'word-block';

    _question.innerText = getQuestion(word);
    _question.className = 'question';

    // question meaning 
    if(word.type === EN_SENTENCE_QESTION) _question.dataset['tooltip'] = word.question_mean;

    _answer.type = 'text';
    _answer.className = 'answer';

    _check.className = 'check';
    _check.innerText = 'check';

    _answer.addEventListener('focusin', () => _block.classList.add('focus'));
    _answer.addEventListener('focusout', () => _block.classList.remove('focus'));

    _correct_answer.className = 'correct-answer';

    _check.tabIndex = -1;
    _check.addEventListener('click', getWordCheckFunction(word, idx));

    _answer.addEventListener('keydown', getWordCheckFunction(word, idx));

    _correct.className = 'action-button correct';
    _correct.innerText = '✓';
    _correct.tabIndex = -1;
    _correct.addEventListener('click', () => changeBoxBackground(word, _block, true));

    _wrong.className = 'action-button wrong';
    _wrong.innerText = 'X';
    _wrong.tabIndex = -1;
    _wrong.addEventListener('click', () => changeBoxBackground(word, _block, false));

    _block.appendChild(_question);
    _block.appendChild(_answer);
    _block.appendChild(_correct_answer);
    _block.appendChild(_check);
    _block.appendChild(_correct);
    _block.appendChild(_wrong);
    _block.dataset['index'] = idx;

    app.appendChild(_block);
  });
}