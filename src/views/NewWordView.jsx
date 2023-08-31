import React, {useState} from 'react';
import {Box, Button, Card, CardHeader, Divider, Modal, TextField, Typography} from "@mui/material";
import {getUuid, submitNewWords} from "../utils";


export default function NewWordView() {
  const [newWords, setNewWords] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [open, setOpen] = useState(false);

  const onAddItem = () => {
    if (isSubmit) return;
    setNewWords([
      ...newWords,
      {
        id: getUuid(),
        english: '',
        korean: '',
        englishQuestion: '',
        englishQuestionMeaning: '',
        englishMeaning: '',
        englishQuestionAnswer: '',
      },
    ]);
  }

  const onRemoveItem = (id) =>
    setNewWords(newWords.filter((newWord) => newWord.id !== id));

  const onChange = ({id, value, key}) =>
    setNewWords(newWords.map((newWord) => newWord.id === id ? {
      ...newWord,
      [key]: value,
    } : newWord));

  const onSubmit = async () => {
    if (isSubmit) return;

    await submitNewWords(newWords);
    setOpen(true);
    setIsSubmit(true);
  }

  return (
    <Card>
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
            성공
          </Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            {newWords.length} 개의 단어를 삽입했습니다.
          </Typography>
        </Box>
      </Modal>
      <CardHeader title="English new words"/>
      <Divider/>
      <Box style={{p: 3, textAlign: 'center'}}>
        {
          newWords.map((newWord) => (
            <Box key={newWord.id} sx={{
              display: 'flex',
              px: 3,
              py: 2,
              bgcolor: 'background.paper',
              borderBottom: 1,
              alignItems: 'center',
              gap: 10,
            }}>
              <TextField
                placeholder="english"
                sx={{width: '15%'}}
                variant="standard"
                onChange={({target: {value}}) => onChange({
                  value,
                  id: newWord.id,
                  key: 'english'
                })}
              />
              <TextField
                placeholder="korean"
                sx={{width: '15%'}}
                variant="standard"
                onChange={({target: {value}}) => onChange({
                  value,
                  id: newWord.id,
                  key: 'korean'
                })}
              />
              <TextField
                placeholder="english meaning"
                sx={{width: '30%'}}
                variant="standard"
                onChange={({target: {value}}) => onChange({
                  value,
                  id: newWord.id,
                  key: 'englishMeaning'
                })}
              />
              <TextField
                placeholder="english question"
                sx={{width: '30%'}}
                variant="standard"
                onChange={({target: {value}}) => onChange({
                  value,
                  id: newWord.id,
                  key: 'englishQuestion'
                })}
              />
              <TextField
                placeholder="english question meaning"
                sx={{width: '30%'}}
                variant="standard"
                onChange={({target: {value}}) => onChange({
                  value,
                  id: newWord.id,
                  key: 'englishQuestionMeaning'
                })}
              />
              <TextField
                placeholder="english question answer"
                sx={{width: '10%'}}
                variant="standard"
                onChange={({target: {value}}) => onChange({
                  value,
                  id: newWord.id,
                  key: 'englishQuestionAnswer'
                })}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onRemoveItem(newWord.id)}
              >X</Button>
            </Box>
          ))
        }
        <Box sx={{p: 5}}>
          <Button variant="contained" color="primary" onClick={onAddItem}>O</Button>
        </Box>
      </Box>
      <Button fullWidth variant="contained" color="success" onClick={onSubmit}>Submit</Button>
    </Card>
  );
}
