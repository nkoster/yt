Download videos from youtube, simple version.

The code is depending on https://www.npmjs.com/package/ytdl

### Usage

```
git clone https://github.com/nkoster/yt
cd yt
npm i
chmod +x index.js
npm link
```

Now you can download a youtube video like this:

```
cd /tmp
ytd https://www.youtube.com/watch?v=Ua2LDqoeFEA
```

Files are saved with normalised names, based on the video title.
