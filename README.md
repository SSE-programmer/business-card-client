# BusinessCardClient

## Обновление линков на свежий сертификат

### Заходим в директорию live
```cd /etc/letsencrypt/live/sse-programmer.com/```

### Обновляем ссылки на самую свежую версию (cert6)
```
ln -sf ../../archive/sse-programmer.com/fullchain6.pem fullchain.pem
ln -sf ../../archive/sse-programmer.com/privkey6.pem privkey.pem
ln -sf ../../archive/sse-programmer.com/cert6.pem cert.pem
ln -sf ../../archive/sse-programmer.com/chain6.pem chain.pem
```
