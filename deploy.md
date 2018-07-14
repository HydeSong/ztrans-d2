ssh root@47.97.168.223
password CX3@yatai

cd /usr/local/

npm run build && tar -cvf cx_web.tar dist/ && scp cx_web.tar root@47.97.168.223:/usr/local/

tar xvf cx_web.tar && rm -rf cx_web && mkdir cx_web && mv dist/* cx_web/ && nginx -s reload
