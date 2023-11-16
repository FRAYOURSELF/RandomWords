// // src/components/RandomWords.js
// 'use client';
// import React, { useState } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';
// import styles from '../styles/RandomWords.module.css';

// const RandomWords = () => {
//   const [words, setWords] = useState([]);
//   const [isFetchEnabled, setIsFetchEnabled] = useState(true);
//   const [isDataSaved, setIsDataSaved] = useState(false);

//   const fetchRandomWords = async () => {
//     setIsFetchEnabled(false);
//     try {
//       const response = await axios.get('https://random-word-api.herokuapp.com/word?number=10');
//       setWords(response.data);
//       setIsFetchEnabled(true);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const saveToLocalStorage = () => {
//     localStorage.setItem('randomWords', JSON.stringify(words));
//     alert('Words saved to local storage!');
//     setIsDataSaved(true);
//   };

//   const fetchFromLocalStorage = () => {
//     const savedWords = JSON.parse(localStorage.getItem('randomWords'));
//     setWords(savedWords || []);
//     setIsDataSaved(!!savedWords);
//   };

//   const deleteFromLocalStorage = () => {
//     localStorage.removeItem('randomWords');
//     alert('Words deleted from local storage!');
//     setIsDataSaved(false);
//   };

//   const clearData = () => {
//     setWords([]);
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.header}>🔀 Random Words</h1>
//       <div className={styles.buttoncontain}>
//         <button onClick={fetchRandomWords} disabled={!isFetchEnabled} className={styles.button}>
//           Fetch data from API
//         </button>
//         <button onClick={saveToLocalStorage} disabled={!isFetchEnabled} className={styles.button}>
//           Save to browser
//         </button>
//         <button onClick={fetchFromLocalStorage} disabled={!isDataSaved || !isFetchEnabled} className={styles.button}>
//           Fetch from browser storage
//         </button>
//         <button onClick={deleteFromLocalStorage} disabled={!isDataSaved} className={styles.button}>
//           Delete from browser storage
//         </button>
//         <button onClick={clearData} disabled={words.length === 0} className={styles.button}>
//           Clear Data
//         </button>
//       </div>
//       <div>
//         {words.length === 0 ? <p className={styles.noWords}>No words to display</p> : (
//           words.map((word, index) => (
//             <p key={index} className={styles.word}>{word}</p>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default RandomWords;
// src/components/RandomWords.js
'use client';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from '../styles/RandomWords.module.css';

const Word = ({ word, index, moveWord }) => {
  const [, ref] = useDrag({
    type: 'WORD',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'WORD',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveWord(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <p ref={(node) => ref(drop(node))} className={styles.word}>
      {word}
    </p>
  );
};

const RandomWords = () => {
  const [words, setWords] = useState([]);
  const [isFetchEnabled, setIsFetchEnabled] = useState(true);
  const [isDataSaved, setIsDataSaved] = useState(false);

  const fetchRandomWords = async () => {
    setIsFetchEnabled(false);
    try {
      const response = await axios.get('https://random-word-api.herokuapp.com/word?number=10');
      setWords(response.data);
      setIsFetchEnabled(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('randomWords', JSON.stringify(words));
    alert('Words saved to local storage!');
    setIsDataSaved(true);
  };

  const fetchFromLocalStorage = () => {
    const savedWords = JSON.parse(localStorage.getItem('randomWords'));
    setWords(savedWords || []);
    setIsDataSaved(!!savedWords);
  };

  const deleteFromLocalStorage = () => {
    localStorage.removeItem('randomWords');
    alert('Words deleted from local storage!');
    setIsDataSaved(false);
  };

  const clearData = () => {
    setWords([]);
  };

  const moveWord = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedWord = words[dragIndex];
      setWords((prevWords) => {
        const newWords = [...prevWords];
        newWords.splice(dragIndex, 1);
        newWords.splice(hoverIndex, 0, draggedWord);
        return newWords;
      });
    },
    [words]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <h1 className={styles.header}>🔀 Random Words</h1>
        <div className={styles.buttoncontainer}>
          <button onClick={fetchRandomWords} disabled={!isFetchEnabled} className={styles.button}>
            Fetch data from API
          </button>
          <button onClick={saveToLocalStorage} disabled={!isFetchEnabled} className={styles.button}>
            Save to browser
          </button>
          <button onClick={fetchFromLocalStorage} disabled={!isDataSaved || !isFetchEnabled} className={styles.button}>
            Fetch from browser storage
          </button>
          <button onClick={deleteFromLocalStorage} disabled={!isDataSaved} className={styles.button}>
            Delete from browser storage
          </button>
          <button onClick={clearData} disabled={words.length === 0} className={styles.button}>
            Clear Data
          </button>
        </div>
        <div>
          {words.length === 0 ? <p className={styles.noWords}>No words to display</p> : (
            words.map((word, index) => (
              <Word key={index} index={index} word={word} moveWord={moveWord} />
            ))
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default RandomWords;
