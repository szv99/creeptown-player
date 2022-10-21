const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('C:/ProgramData/chocolatey/bin/yt-dlp.exe');
const bodyParser = require('body-parser');
const httpServer = require("http").createServer();
const fs = require('fs')
const io = require("socket.io")(httpServer, {
  // ...
});
const crypto = require('crypto');
const child = require('child_process');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, 'static')))

let songs = []

let users = []

let usersCount = 0

let skipCount = 0

io.on("connection", (socket) => {
  if(songs.length === 0){
    console.log('spierdalej')
  }else{ 
    socket.emit('playSong', songs[0])
  }
  socket.on('userJoined', function(spierdalaj){
    dupek = {
      nickname: spierdalaj,
      vote: false
    }
    if(users.some(({nickname}) => nickname === dupek.nickname)){
      console.log('spierdalaj...')
  }else{
    users.push(dupek)
    usersCount++
  }
  })

});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post("/local_data", async (req, res) =>
{

  const songArray = {
    "linkToSong": req.body.uid,
    "userNickname": req.body.nickname
  }

  res.json({
    "email": "added song"
  })
	addSong(songArray)
})

app.post("/get_queue", async (req, res) =>
{
  let songQueue = JSON.parse(fs.readFileSync('./queue.json'))

  res.json(songQueue)
})

function getVideoId(input) {
  return input.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/)[1]; 
  }


async function addToHistory(songJSON){
  let songHistory = JSON.parse(fs.readFileSync('./history.json'))

  songHistory.push(songJSON)

  fs.writeFileSync('./history.json', JSON.stringify(songHistory))

  let songQueue = JSON.parse(fs.readFileSync('./queue.json'))

  songQueue.push(songJSON)

  fs.writeFileSync('./queue.json', JSON.stringify(songHistory))

}

async function removeFromQueue(){
  let songQueue = JSON.parse(fs.readFileSync('./queue.json'))

  songQueue.shift()

  fs.writeFileSync('./queue.json', JSON.stringify(songQueue))
}


async function addSong(songArray){
  let songLink = songArray.linkToSong
  console.log(songLink)

  if(songLink.includes('soundcloud')){

  }
  const uniqueSongId = crypto.randomUUID()

  
  let metadata = await ytDlpWrap.getVideoInfo(songLink)
  
  let songInfo = {
    "title": metadata.title,
    "artist": metadata.artist,
    "songId": uniqueSongId,
    "thumbnailUrl": '',
    "songUrl": songLink,
    "username": songArray.userNickname
  }

  
  
  
  if(songLink.includes('youtube.com') || songLink.includes('youtu.be')){
    id = getVideoId(songLink)
    console.log(songLink + id)
    songInfo.thumbnailUrl = `https://img.youtube.com/vi/${id}/0.jpg`
  }
  
  addToHistory(songInfo)
  io.emit('addedSong', songInfo)

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
    .on('close', () => doneDownloading(songInfo));

    console.log(ytDlpEventEmitter.ytDlpProcess.pid);
}


async function doneDownloading(uniqueSongId){

  console.log(uniqueSongId)

  if(songs.length === 0){
    console.log('ssss')
    songs.push(uniqueSongId)
    playSong()
  }else{
    console.log('sssexexes')
    songs.push(uniqueSongId)
  }
}

let gstMuxer

async function playSong(guwno){

  console.log(guwno)
  if(guwno === 'siemka'){
    console.log('qasfsdfgd')
    gstMuxer.kill('SIGINT')
    return
  }

  let siemaEniu = ''

  siemaEniu = songs[0]

  console.log(siemaEniu)

  const args = getGstPipelineArguments()
  const cmd = 'gst-launch-1.0';
  console.log(args)
  console.log(songs[0])
  io.emit('playSong', songs[0])
  gstMuxer = child.spawn('gst-launch-1.0', args);


  gstMuxer.stderr.on('data', onSpawnError);
  gstMuxer.on('exit', onSpawnExit);
}


app.post("/vote_skip", async (req, res) =>
{
	const voteState = skipSong(req.body.nickname)
  if(voteState === "voted_success"){
    res.json({
      "voteState": "voted_success"
    }) 
  }else{
    res.json({
      "voteState": "already_voted"
    }) 
  }
})


function countSkipCount(){
  if(Math.floor((skipCount / usersCount) * 100) > 51){
    playSong('siemka')
    skipCount = 0
    for (const key in users){
      console.log(users[key].nickname)
      users[users.findIndex(({nickname}) => nickname === users[key].nickname)].vote = false
  }
  }
}

async function skipSong(username){
    console.log(users)
  if(users[users.findIndex(({nickname}) => nickname === username)].vote === false){
    users[users.findIndex(({nickname}) => nickname === username)].vote = true
    skipCount++
    countSkipCount()
    return "voted_success"
  }else{
    return "already_voted"
  }


  //playSong('siemka')
  //onSpawnExit()
}

function getGstPipelineArguments() {

  let siemaEniu = ''

  siemaEniu = songs[0].songId


  const args = ["filesrc", 'location=' + siemaEniu + ".mp3", '!', 'mpegaudioparse', "!", 'mpg123audiodec', "!", 'audioconvert', "!", 'audioresample', "!", 'autoaudiosink']

  return args;
}

async function onSpawnError(data){
  console.log(data.toString())
}

async function onSpawnExit(){
  removeFromQueue()
  io.emit('deleteDiv', songs[0])
  songs.shift()
  if(songs.length === 0){
  }else{
    playSong(songs[0])
  }
}

httpServer.listen(7071);
