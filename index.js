// Imports the Google Cloud client library
const { projectId, keyFilename, audioFilePath, bucketName } = require('./keys/secrets')
const speech = require('@google-cloud/speech');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId, keyFilename });
const sound_files = storage.bucket('sound_files_gaa');

// Creates a client
const client = new speech.SpeechClient();

async function speechToFreqChart(filename) {

  // if(process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  //   console.log('It is set!');
  // }
  // else {
  //     console.log('Not set!');
  // }

  const filename = 'test4'

  const options = {
    destination: `${filename}.flac`,
    public:true
  }
  await sound_files.upload(`${audioFilePath}${filename}.flac`, options)

  const gcsUri = `${bucketName}${filename}.flac`;
  const encoding = 'FLAC';
  const sampleRateHertz = 16000;
  const languageCode = 'en-US';

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
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
  const transcription = response.results
    .map(result => (result.alternatives[0].transcript).trim())

  // Create a frequency chart called 'dict' with the transcript
  const dict = {}
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
speechToFreqChart()

module.exports = {
  speechToFreqChart
}
