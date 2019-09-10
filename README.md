#Vecty

#Requirements

```
#$ sudo apt-get install npm
```

#Build and run

```
#/work/code/vecty$ npm install
#/work/code/vecty$ node app.js
```

#Use
Send an image via curl with:

```
curl -X POST -F "srcImg=@/home/fds/work/code/vecty/test-data/suora.jpg" http://localhost:8000/vectymelo
```
