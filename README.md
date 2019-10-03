# Vecty

Take a shortcut. Create and modifying drawings from pictures.

## Requirements

```
#$ sudo apt-get install npm
```

# Build and run 
## From source

```
#/work/code/vecty$ npm install
#/work/code/vecty$ node app.js
```

In app.js there's hardcoded the github access token for the f-ds account (very secure :)

## From docker image

```
#/work/code/vecty$ docker build -t vecty .
#/work/code/vecty$ docker run -it --rm --name vecty -p 8000:8000 vecty
```

# Use

Send an image via curl with:

```
curl -X POST -F "srcImg=@/<abs_path_vecty_repo>/test-data/suora.jpg" http://localhost:8000/vectymelo
```

or upload it accessing to ``http://localhost:8000/vecty.html``

# Data storage

The files ingested are stored in a public github repo on master branch, see here -> https://github.com/f-ds/vecty-data
