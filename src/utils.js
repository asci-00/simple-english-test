import axios from "axios";
/* eslint-disable */
export const EN_QUESTION = 0;
export const EN_SENTENCE_QUESTION = 1;
export const KO_QUESTION = 2;

export const getUuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
//
export const isCorrectAnswer = (word, input) => {
  const correctAnswer = getCorrectAnswer(word);
  if (word.type === EN_QUESTION) return !!(input && correctAnswer.includes(input));
  else return correctAnswer === input;
}
//
const getCorrectAnswer = ({type, answer, english, korean}) => {
  switch (type) {
    case EN_SENTENCE_QUESTION:
      return answer.trim();
    case KO_QUESTION:
      return english.trim();
    case EN_QUESTION:
      return korean.trim();
    default:
      return false;
  }
}

export const getQuestion = ({type, english, korean, question}) => {
  switch (type) {
    case EN_SENTENCE_QUESTION:
      return question;
    case KO_QUESTION:
      return korean;
    case EN_QUESTION:
      return english;
    default:
      return '';
  }
}
//
// const getWordCheckFunction = (word, index) => (ev) => {
//   if (ev && ev.type === 'keydown' && !(ev.key === 'Enter')) return;
//
//   const _block = document.querySelector(`[data-index='${index}']`);
//   const _correct_answer = _block.querySelector('.correct-answer');
//   const _answer = _block.querySelector('.answer');
//
//   const input_answer = _answer.value.trim();
//
//   if (ev === true) {
//     _answer.disabled = true;
//     _correct_answer.style.width = '100px';
//     _correct_answer.innerText = getCorrectAnswer(word);
//   }
//
//   const res = isCorrectAnswer(word, input_answer);
//   console.log(res);
//   changeBoxBackground(word, _block, res);
//
//   return res ? 1 : 0;
// }
//
// const allCheckCallback = (words) => {
//   submit.disabled = false;
//
//   return words
//     .map(getWordCheckFunction)
//     .map(callback => callback(true))
//     .reduce((acc, curr) => acc += curr, 0);
// }
//
export const submitExamResult = async (words) => await axios.post('http://192.168.101.128:5000/apply_result', words.map(word => ({
  id: word.id,
  type: word.type,
  correct: word.correct,
  question_mean: word.question_mean,
})));

export const submitNewWords = async (words) => await axios.post('http://192.168.101.128:5000/english_words', words.map(word => ({
  english: word.english,
  korean: word.korean,
  english_meaning: word.englishMeaning,
  english_question: word.englishQuestion,
  english_question_meaning: word.englishQuestionMeaning,
  english_question_answer: word.englishQuestionAnswer,
})));

export const getWordList = async () => (await axios.get('http://192.168.101.128:5000/english_words')).data.map(word => (
  {
    ...word,
    correct: null,
    type: getRandomItem([
      KO_QUESTION,
      EN_QUESTION,
      ...(word.question && word.question !== '%s' ? [EN_SENTENCE_QUESTION] : [])
    ])
  }
));

// async function App() {
//   const word_list = (await axios.get('http://127.0.0.1:5000/english_words')).data.map(word => (
//     {
//       ...word,
//       correct: false,
//       type: getRandomItem([
//         KO_QUESTION,
//         EN_QUESTION,
//         ...(word.question && word.question !== '%s' ? [EN_SENTENCE_QUESTION] : [])
//       ])
//     }
//   ));
//
//   const question_mean_request_target = word_list
//     .filter(({type, question_mean}) => type === EN_SENTENCE_QUESTION && question_mean === null)
//     .map(({question, answer, id}) => ({
//       id,
//       string: question.replace('%s', answer),
//     }));
//
//   console.log(`[App-get-mean-api] ${question_mean_request_target}`)
//
//   if(question_mean_request_target.length) await axios('http://127.0.0.1:5000/question_means',
//     { params: { data: question_mean_request_target.map(({string}) => string) } },
//   ).then(({data: question_means}) => {
//     console.log(question_means);
//
//     question_mean_request_target.forEach(({id}, idx) => {
//       const target_word = word_list.find(({id: _id}) => id === _id);
//       target_word.question_mean = question_means[idx];
//     });
//   })
// }
