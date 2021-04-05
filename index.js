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

    const output = info.videoDetails.title
      .replace(/ /g, '_')
      .replace(/['"`|]/g, '_')
      + '.mp4'

    console.log('Download:', '"' + info.videoDetails.title + '"')

    console.log('Video Length:',
      (info.videoDetails.lengthSeconds / 60).toFixed(0) + '.' +
      (info.videoDetails.lengthSeconds % 60),
      'Minutes')
  
    let size = 0
  
    ytdl.chooseFormat(info.formats, { quality: 'highest'})
  
    ytdl.downloadFromInfo(info, {
      dlChunkSize: 102400,
      filter: 'audioandvideo',
      quality: 'highestvideo'
    })
    .on('progress', data => {
      size += Number(data)
      process.stdout.write('\rd/l ' + size + ' Bytes')
    })
    .pipe(fs.createWriteStream(output))
    .on('error', err => {
      console.log(err.message)
      process.exit(2)
    })
    .on('finish', _ => {
      console.log('\r' + output + ': ' + size + ' Bytes')
      process.exit(0)
    })
  
  } else {
    console.log('No youtube link provided')
  }

})()
