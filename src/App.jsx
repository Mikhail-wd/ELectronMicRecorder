import { useState, useRef } from 'react';
import './App.css'

import { useEffect } from 'react';


function App() {
  const [recording, setRecording] = useState(true);
  const [audio, setAudio] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorder = useRef(null);
  const audioRef = useRef()
  const options = { mimeType: 'audio/webm' }

  const startRecording = async () => {
    setRecording(false)
    const streamData = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const media = new MediaRecorder(streamData, options);
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecording(true)
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, options);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
  }, [])
  return (
    <div className='mainFraim '>
      <div className='app'>
        <div className='controlls'>
          {recording ?
            <button className='record' onClick={() => startRecording()}>record</button>
            :
            <button className='stop' onClick={() => stopRecording()}>stop</button>
          }

        </div>
        <div className='sound'>
          <audio src={audio} controls ref={audioRef}></audio>
        </div>
        <div className='download'>
          <a href={audio} download={audio} className='font'>download</a>
        </div>
      </div>



    </div>
  )
}
export default App
