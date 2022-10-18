const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('C:/ProgramData/chocolatey/bin/yt-dlp.exe');
const bodyParser = require('body-parser');
const crypto = require('crypto');
console.log(crypto.randomUUID());

const child = require('child_process');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, 'static')))


let songs = []

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post("/local_data", async (req, res) =>
{
	const userid = req.body.uid;
  res.json({
    "email": "added song"
  })
	addSong(userid)
})

async function addSong(songLink){
  console.log(songLink)
  const uniqueSongId = crypto.randomUUID()
  let ytDlpEventEmitter = ytDlpWrap
    .exec([
        songLink,
        '-x',
        '--audio-format',
        'mp3',
        '-f',
        'best',
        '-o',
        `${uniqueSongId}.mp3`,
    ])
    .on('progress', (progress) =>
        console.log(
            progress.percent,
            progress.totalSize,
            progress.currentSpeed,
            progress.eta
        )
    )
    .on('ytDlpEvent', (eventType, eventData) =>
        console.log(eventType, eventData)
    )
    .on('error', (error) => console.error(error))
    .on('close', () => doneDownloading(uniqueSongId));

    console.log(ytDlpEventEmitter.ytDlpProcess.pid);
}


async function doneDownloading(uniqueSongId){
  console.log('simea')

  if(songs.length === 0){
    console.log('ssss')
    songs.push(uniqueSongId + ".mp3")
    playSong()
  }else{
    console.log('sssexexes')
    songs.push(uniqueSongId + ".mp3")
  }
}

async function playSong(){

  let siemaEniu = ''

  siemaEniu = songs[0]

  console.log(siemaEniu)

  const args = getGstPipelineArguments()
  const cmd = 'gst-launch-1.0';
  console.log(args)
  const gstMuxer = child.spawn('gst-launch-1.0', args);


  gstMuxer.stderr.on('data', onSpawnError);
  gstMuxer.on('exit', onSpawnExit);
}

function getGstPipelineArguments(tcpServer) {
  const args =
      ['/Users/alexandernnakwue/Downloads/samplevideo.mp4', 'pattern=ball',
          '!', 'video/x-raw,width=320,height=240,framerate=100/1',
          '!', 'vpuenc_h264', 'bitrate=2000',
          '!', 'mp4mux', 'fragment-duration=10',
          '!', 'tcpclientsink', 'host=localhost',
          'port=' + tcpServer.address().port];
  return args;
}

function getGstPipelineArguments() {

  let siemaEniu = ''

  siemaEniu = songs[0]


  const args = ["filesrc", 'location=' + siemaEniu, '!', 'mpegaudioparse', "!", 'mpg123audiodec', "!", 'audioconvert', "!", 'audioresample', "!", 'autoaudiosink']

  return args;
}

async function onSpawnError(data){
  console.log(data.toString())
}

async function onSpawnExit(){
  songs.shift()
  playSong(songs[0])
}