const YTDlpWrap = require('yt-dlp-wrap').default;
const crypto = require('crypto');
const ytDlpWrap = new YTDlpWrap('C:/ProgramData/chocolatey/bin/yt-dlp.exe');

async function getMetadata(songLink){
let metadata = await ytDlpWrap.getVideoInfo(songLink)

const uniqueSongId = crypto.randomUUID()

console.log(metadata)

let songInfo = {
  "title": metadata.title,
  "artist": metadata.artist,
  "songId": uniqueSongId
}

console.log(songInfo)

}

getMetadata('https://soundcloud.com/scarecrowkrk/httpprofeat_dead_baronsui_generisprodkillgeneris')