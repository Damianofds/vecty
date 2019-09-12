###Vecty

Take a shortcut. Create and modifying drawings from pictures.

###Requirements

```
#$ sudo apt-get install npm
```

###Build and run

```
#/work/code/vecty$ npm install
#/work/code/vecty$ node app.js
```

In app.js there's hardcoded the github access token for the f-ds account (very secure :)

###Use
Send an image via curl with:

```
curl -X POST -F "srcImg=@/<abs_path_vecty_repo>/test-data/suora.jpg" http://localhost:8000/vectymelo
```

or upload it accessing to ``http://localhost:8000/vecty.html``
