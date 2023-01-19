import './App.css';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

// speech to text and save to notes

// speech to text api - https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// set up the recognition object parameters
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

function App() {

  // set up the state
  const [note, setNote] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // listen for the start of speech and set the state
  useEffect(() => {
    handleListen();
  }, [isListening]);


  const handleListen = () => {
    if (isListening) {
      recognition.start(); // start listening
      recognition.onend = () => { // when the user stops speaking
        console.log("...continue to listen...");
        recognition.start();
      }
    } else {
      recognition.stop(); // stop listening
      recognition.onend = () => {
        console.log("Stopped listening per click");
      }
    }
    recognition.onstart = () => {
      console.log("Listening!");
    }

    // create a new transcript
    recognition.onresult = (e) => {
      console.log(e);
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      console.log(transcript);
      setNote(transcript)
      recognition.onerror = event => {
        console.log(event.error)
      }
    }
  }


  return (
    <>

      <div className="card border-primary mb-3" style={{ "max-width": "20rem" }}>
        <div className="card-header">Speech to text app</div>
        <div className="card-body">
          <h4 className="card-title">Current Note {isListening ? <span >🛑🎙️</span> : <span >🎙️</span>}</h4>

          <div className='ctl-btn'>
            <button className="btn btn-primary" onClick={() => setIsListening(prevState => true)} disabled={isListening}>Start</button>
            <button className="btn btn-primary" onClick={() => setIsListening(prevState => false)} disabled={!isListening}>Stop</button>
          </div>

          <p className="card-text">{note}</p>
        </div>
      </div>
    </>
  );
}

export default App;
