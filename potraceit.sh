#!/bin/sh
echo "**************** cmd script: START ***************"
echo "Running the processing script! parameters are:"
echo "file name: $1"
echo "workdir : $2"

echo "1) Imagemagik convert: convert the input file to pbm"
echo "convert $1 $2/sample.pbm"
convert $1 $2"/sample.pbm"

echo "2) Potrace: generate the SVG output"
echo "potrace --svg -r 1 $2/sample.pbm -o $2/out.svg"
potrace --svg -r 1 "$2/sample.pbm" -o "$2/out.svg"

echo "3) Base64: Encode SVG output in Base64"
cat "$2/out.svg" | base64 > "$2/outBase64"
cat "$2/out.svg" | base64 > "$2/outBase64"

echo "**************** cmd script: END ***************"