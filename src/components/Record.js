import { useState, useEffect } from "react";
import { useRecordWebcam } from "react-record-webcam";

function App() {
  const initialTime = 180; // 3 minutes in seconds

  const [recordingID, setRecordingID] = useState(null);
  const [time, setTime] = useState(initialTime);
  const [running, setRunning] = useState(false);
  const [hideDownload, setHideDownload] = useState(true);
  const [permissionIssue, setPermissionIssue] = useState({
    Owner: "",
    Status: "",
  });
  const checkCameraPermission = async () => {
    try {
      const cameraPermissionStatus = await navigator.permissions.query({
        name: "camera",
      });

      if (cameraPermissionStatus.state === "denied") {
        setPermissionIssue({ Owner: "camera", Status: "denied" });
      } else if (cameraPermissionStatus.state === "prompt") {
        setPermissionIssue({ Owner: "camera", Status: "Pending Approval" });
      }
    } catch (error) {
      console.error("Error checking camera permission:", error);
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const microphonePermissionStatus = await navigator.permissions.query({
        name: "microphone",
      });

      if (microphonePermissionStatus.state === "denied") {
        setPermissionIssue({ Owner: "microphone", Status: "Denied" });
      } else if (microphonePermissionStatus.state === "prompt") {
        setPermissionIssue({ Owner: "microphone", Status: "Pending Approval" });
      }
    } catch (error) {
      console.error("Error checking microphone permission:", error);
    }
  };

  // Call the functions to check permissions

  const {
    activeRecordings,
    createRecording,
    openCamera,
    startRecording,
    stopRecording,
    download,
  } = useRecordWebcam();

  const Start = async () => {
    try {
      setHideDownload(true);
      setRunning(true);

      const recording = await createRecording();
      setRecordingID(recording.id);
      if (!recording) return;

      await openCamera(recording.id);
      await startRecording(recording.id);

      // Delay the execution of stopRecording by 3 minutes
      setTimeout(async () => {
        await stopRecording(recording.id);
        setRunning(false);
        setTime(initialTime);
        setHideDownload(false);
      }, 3 * 60 * 1000); // 3 minutes in milliseconds
    } catch (error) {
      console.error({ error });
    }
  };

  const Stop = async () => {
    try {
      setHideDownload(false);

      await stopRecording(recordingID);
      setRunning(false);
      setTime(initialTime);
    } catch (error) {
      console.error({ error });
    }
  };
  const Download = async () => {
    try {
      await download(recordingID);
    } catch (error) {}
  };
  useEffect(() => {
    checkCameraPermission();
    checkMicrophonePermission();
  }, []);
  useEffect(() => {
    let timer;

    if (running && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [running, time]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };
  return permissionIssue.Owner ? (
    <p style={{ marginTop: "60px" }}>
      {permissionIssue.Owner} access is {permissionIssue.Status}
    </p>
  ) : (
    <div style={{ marginTop: "60px" }}>
      <button onClick={Start}>Start</button>
      <button onClick={Stop}>Stop</button>
      <span className="Timer">{formatTime(time)}</span>
      {!hideDownload && <button onClick={Download}>Upload</button>}
      <div className="recordings">
        {activeRecordings.map((recording) => (
          <div
            key={recording.id}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <p>footage</p>

              <video ref={recording.webcamRef} autoPlay muted />
            </div>
            <div
              className="preview"
              className={recording.status === "STOPPED" ? "show" : "hide"}
            >
              <p>Preview</p>
              {!hideDownload && <video ref={recording.previewRef} controls />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
