#!/usr/bin/env node

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
      .replace(/[ '"`.,~#|/\\!?\]\[(){}#$%&*=+:;<>]/g, '_')
      + '.mp4'

    console.log('Download:', '"' + info.videoDetails.title + '"')

    const pad = (val, size) => {
      const s = '00' + val
      return s.substr(s.length - size)
    }

    console.log('Video Length:',
      (Math.floor(info.videoDetails.lengthSeconds / 60)).toFixed(0) + '.' +
      pad(info.videoDetails.lengthSeconds % 60, 2),
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
      process.stdout.write('\rD/L ' + size + ' Bytes')
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
