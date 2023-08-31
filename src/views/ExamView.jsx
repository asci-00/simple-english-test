import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Divider,
  Modal,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';
import CancelIcon from '@mui/icons-material/Cancel';
import {useCallback, useEffect, useState} from "react";
import {EN_SENTENCE_QUESTION, getQuestion, getWordList, isCorrectAnswer, submitExamResult,} from "../utils";

let answers = [];

export default function ExamView() {
  const [words, setWords] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line
  }, []);

  const initialize = useCallback(async () => {
    const res = await getWordList();
    answers = new Array(res.length).fill('');
    setWords(res);
  }, []);
  const onKeyDown = (targetWord, ev) => {
    if (ev.code !== 'Enter') return;

    setWords(words.map((word) =>
      word.id === targetWord.id ?
        {...word, correct: isCorrectAnswer(targetWord, ev.target.value)} :
        word
    ));
  }
  const onTextChange = (targetIdx, ev) => {
    const {target: {value}} = ev;
    answers[targetIdx] = value;
  };
  const onCheck = () =>
    setWords(words.map((word, idx) =>
      ({...word, correct: isCorrectAnswer(word, answers[idx])})
    ));

  const onSubmit = async () => {
    try {
      await submitExamResult(words);
      setOpen(true);

    } catch (err) {
      console.err(err);
    }
  }


  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            결과
          </Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            {`${words.filter((word) => word.correct).length} / ${words.length}`}
          </Typography>
        </Box>
      </Modal>
      <Card>
        <CardHeader title="English Words Exam"/>
        <Divider/>
        <Box style={{p: 3}}>
          {
            words.map((word, idx) => (
              <Box key={word.id} sx={{
                display: 'flex',
                p: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                alignItems: 'center',
              }}>
                {
                  word.correct == null ?
                    <CreateIcon sx={{mr: 2}} color="primary"/> :
                    word.correct ?
                      <CheckCircleIcon sx={{mr: 2}} color="success"/> :
                      <CancelIcon sx={{mr: 2}} color="error"/>
                }
                <Tooltip title={word.type === EN_SENTENCE_QUESTION ? word.question_mean : 'fighting'}>
                  <Box sx={{flexShrink: 0, cursor: 'pointer',}}>{getQuestion(word)}</Box>
                </Tooltip>
                <Box sx={{width: '100%', minWidth: 200}} mx={3}>
                  <TextField
                    key={word.id}
                    sx={{width: '100%'}}
                    variant="standard"
                    onKeyDown={(ev) => onKeyDown(word, ev)}
                    onChange={(ev) => onTextChange(idx, ev)}
                  />
                </Box>
                <ButtonGroup>
                  <Button variant="contained" color="primary" onClick={() => isCorrectAnswer(word, answers[idx])}
                          tabIndex={-1}>O</Button>
                  <Button variant="contained" color="secondary" onClick={console.log} tabIndex={-1}>X</Button>
                </ButtonGroup>
              </Box>
            ))
          }
        </Box>
        <Box component='div' sx={{mt: 3, p: 3,}} style={{backgroundColor: '#eee'}}>
          <ButtonGroup component='div' fullWidth variant="contained">
            <Button color="info" onClick={onCheck}>확인</Button>
            <Button color="warning" onClick={onSubmit}>제출</Button>
          </ButtonGroup>
        </Box>
      </Card>
    </>
  );
}
