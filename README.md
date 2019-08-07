# High-performance image or pdf creation with phantomjs pool

[![Latest Version](https://img.shields.io/github/release/damyth/phantomjs-browsershot.svg?style=flat-square)](https://github.com/damyth/phantomjs-browsershot/releases)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Total Downloads](https://img.shields.io/npm/dt/phantomjs-browsershot)](https://www.npmjs.com/package/phantomjs-browsershot)

Phantomjs-browsershot runs as a service.

## Advantages
This package runs as a service. It goes not attached to a tool or software.
This can process 12 images simultaneously. 
You can generate high-quality images than dataurl ( dataurl only supports up to 72dpi )

## How to install

git clone git@github.com:damyth/phantomjs-browsershot.git browsershot
cd browsershot
npm install
npm run app.js

** For run ith the server continuously, you can use a node process manager (pm2, etc)

## Test
Send a CURL request via terminal

curl -XPOST -H "Content-type: application/json" -d '{"urls":[{"url":"local_url_to_print","save_path": "local_path_to_save_file/a.jpg"}],"public_path":"/"}' 'localhost:3030/prints

## Help & info
Please feel free to contact me if you need more details regarding this package. I'll update this when I have time. But until then, let's talk.. :)