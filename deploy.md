ssh root@47.98.191.141
password 18JiAn@61

cd /usr/local/

npm run build && tar -cvf cx_web.tar dist/ && scp cx_web.tar root@47.98.191.141:/usr/local/

tar -xvf cx_web.tar && rm -rf cx_web && mkdir cx_web && mv dist/* cx_web/ && nginx -s reload
