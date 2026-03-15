# BusinessCardClient

## Обновление линков на свежий сертификат

### Заходим в директорию live
```cd /etc/letsencrypt/live/sse-programmer.com/```

### Обновляем ссылки на самую свежую версию (cert5)
```
ln -sf ../../archive/sse-programmer.com/fullchain5.pem fullchain.pem
ln -sf ../../archive/sse-programmer.com/privkey5.pem privkey.pem
ln -sf ../../archive/sse-programmer.com/cert5.pem cert.pem
ln -sf ../../archive/sse-programmer.com/chain5.pem chain.pem
```
