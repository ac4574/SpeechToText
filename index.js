// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

async function quickstart() {

  if(process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('It is set!');
  }
  else {
      console.log('Not set!');
  }

  const gcsUri = 'gs://sound_files_gaa/test2.flac';
  const encoding = 'FLAC';
  const sampleRateHertz = 48000;
  const languageCode = 'en-US';

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    audioChannelCount: 2
  };

  const audio = {
    uri: gcsUri,
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const dict = {}
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    // .join('\n');
  for (let i=0; i<transcription.length; i++) {
    let currWord = transcription[i]
    if (!dict[currWord]) {
      dict[currWord] = 1
    } else {
      dict[currWord] += 1
    }
  }

  console.log(`Chart: ${JSON.stringify(dict)}`)
}
quickstart()
