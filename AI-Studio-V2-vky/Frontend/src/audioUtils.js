// utils/audioUtils.js

class AudioManager {
  constructor() {
    this.audioInstances = new Map();
    this.currentlyPlaying = null;
  }

  /**
   * Convert base64 audio to blob and create audio URL
   */
  createAudioFromBase64(base64Audio, format = "audio/mpeg") {
    try {
      const audioBlob = new Blob(
        [Uint8Array.from(atob(base64Audio), (c) => c.charCodeAt(0))],
        { type: format }
      );
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error creating audio from base64:", error);
      return null;
    }
  }

  /**
   * Play audio with proper cleanup and state management
   */
  async playAudio(audioUrl, messageId, onPlay, onEnd, onError) {
    try {
      // Stop any currently playing audio
      this.stopCurrentAudio();

      const audio = new Audio(audioUrl);
      this.audioInstances.set(messageId, audio);
      this.currentlyPlaying = messageId;

      // Set up event listeners
      audio.onplay = () => {
        if (onPlay) onPlay(messageId);
      };

      audio.onended = () => {
        this.cleanup(messageId, audioUrl);
        if (onEnd) onEnd(messageId);
      };

      audio.onerror = (error) => {
        this.cleanup(messageId, audioUrl);
        if (onError) onError(messageId, error);
      };

      // Play the audio
      await audio.play();
      return true;
    } catch (error) {
      console.error("Error playing audio:", error);
      this.cleanup(messageId, audioUrl);
      if (onError) onError(messageId, error);
      return false;
    }
  }

  /**
   * Stop currently playing audio
   */
  stopCurrentAudio() {
    if (this.currentlyPlaying) {
      const audio = this.audioInstances.get(this.currentlyPlaying);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        this.cleanup(this.currentlyPlaying, audio.src);
      }
    }
  }

  /**
   * Stop specific audio by message ID
   */
  stopAudio(messageId) {
    const audio = this.audioInstances.get(messageId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.cleanup(messageId, audio.src);
    }
  }

  /**
   * Clean up audio resources
   */
  cleanup(messageId, audioUrl) {
    if (audioUrl && audioUrl.startsWith("blob:")) {
      URL.revokeObjectURL(audioUrl);
    }
    this.audioInstances.delete(messageId);
    if (this.currentlyPlaying === messageId) {
      this.currentlyPlaying = null;
    }
  }

  /**
   * Check if audio is currently playing for a message
   */
  isPlaying(messageId) {
    return this.currentlyPlaying === messageId;
  }

  /**
   * Get current playing message ID
   */
  getCurrentlyPlaying() {
    return this.currentlyPlaying;
  }

  /**
   * Clean up all audio resources
   */
  cleanupAll() {
    this.audioInstances.forEach((audio, messageId) => {
      audio.pause();
      audio.src = "";
      if (audio.src && audio.src.startsWith("blob:")) {
        URL.revokeObjectURL(audio.src);
      }
    });
    this.audioInstances.clear();
    this.currentlyPlaying = null;
  }
}

// Voice recording utilities
class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isRecording = false;
  }

  /**
   * Check if browser supports voice recording
   */
  isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Start voice recording
   */
  async startRecording(onStart, onStop, onError) {
    if (!this.isSupported()) {
      throw new Error("Voice recording not supported in this browser");
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.getSupportedMimeType(),
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: this.getSupportedMimeType(),
        });
        this.isRecording = false;
        if (onStop) onStop(audioBlob);
        this.cleanup();
      };

      this.mediaRecorder.onerror = (error) => {
        this.isRecording = false;
        if (onError) onError(error);
        this.cleanup();
      };

      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;

      if (onStart) onStart();
    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  /**
   * Stop voice recording
   */
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }
  }

  /**
   * Get supported MIME type for recording
   */
  getSupportedMimeType() {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/wav",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "audio/wav"; // fallback
  }

  /**
   * Clean up recording resources
   */
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Get recording status
   */
  getRecordingStatus() {
    return this.isRecording;
  }
}

// TTS API utilities
class TTSService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.audioManager = new AudioManager();
  }

  /**
   * Convert text to speech
   */
  async textToSpeech(text, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/api/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: options.voice || "default",
          speed: options.speed || 1.0,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("TTS Service Error:", error);
      throw error;
    }
  }

  /**
   * Play TTS audio
   */
  async playTTS(text, messageId, callbacks = {}) {
    try {
      const { onStart, onPlay, onEnd, onError } = callbacks;

      if (onStart) onStart(messageId);

      const ttsData = await this.textToSpeech(text);

      if (!ttsData.audio) {
        throw new Error("No audio data received from TTS service");
      }

      const audioUrl = this.audioManager.createAudioFromBase64(ttsData.audio);

      if (!audioUrl) {
        throw new Error("Failed to create audio URL");
      }

      return await this.audioManager.playAudio(
        audioUrl,
        messageId,
        onPlay,
        onEnd,
        onError
      );
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(messageId, error);
      }
      throw error;
    }
  }

  /**
   * Stop TTS playback
   */
  stopTTS(messageId) {
    this.audioManager.stopAudio(messageId);
  }

  /**
   * Stop all TTS playback
   */
  stopAllTTS() {
    this.audioManager.stopCurrentAudio();
  }

  /**
   * Check if TTS is playing
   */
  isPlaying(messageId) {
    return this.audioManager.isPlaying(messageId);
  }

  /**
   * Clean up all resources
   */
  cleanup() {
    this.audioManager.cleanupAll();
  }
}

export { AudioManager, VoiceRecorder, TTSService };
