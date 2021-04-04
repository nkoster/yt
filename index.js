(async _ => {

  if (process.argv.length > 2) {

    const yt = process.argv[2]
    const fs = require('fs')
    const ytdl = require('ytdl-core')
    
    let vid

    try {
      vid = ytdl.getVideoID(yt)
    } catch (err) {
      console.log(err.message)
      process.exit(1)
    }

    const info = await ytdl.getInfo(vid)
    console.log(info.videoDetails.title)

    console.log('video length:', info.videoDetails.lengthSeconds, 'seconds')
  
    let size = 0
  
    ytdl.chooseFormat(info.formats, { quality: 'highest'})
  
    ytdl.downloadFromInfo(info, {
      dlChunkSize: 102400,
      filter: 'audioandvideo',
      quality: 'highestvideo'
    })
    .on('progress', data => {
      size += Number(data)
      process.stdout.write('\rd/l ' + size + ' bytes')
    })
    .pipe(fs.createWriteStream(__dirname + '/' + vid + '.mp4'))
    .on('error', err => {
      console.log(err.message)
      process.exit(2)
    })
    .on('finish', _ => {
      console.log('\r' + size + ' bytes downloaded       ')
      process.exit(0)
    })
  
  } else {
    console.log('No youtube link provided')
  }

})()
