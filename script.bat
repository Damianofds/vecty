@echo off

echo "**************** cmd script: START***************"

echo "Running the processing script! working directory is: '"%2"'" 

echo "1) Imagemagik convert: convert the input file to pbm"
call D:\work\programs\ImageMagick-6.9.2-Q16-static\convert %1 %2"/"sample.pbm


echo "2) Potrace: generate the SVG output"
call D:\work\programs\potrace-1.12.win64\potrace --svg -r 1 %2"/"sample.pbm -o %2"/"out.svg

echo "3) Base64: Encode SVG output in Base64"
call cat %2"/"out.svg | base64 > %2"/"outBase64
echo "**************** cmd script: END***************"
