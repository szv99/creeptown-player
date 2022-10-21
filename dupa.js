function get_video_id(input) {
return input.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/)[1]; 
}

gowno = get_video_id('https://youtu.be/3w8pR1ihXOI')

console.log(gowno)