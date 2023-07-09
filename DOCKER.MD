# UI for Libra - AI Legal Assistant

### Docker build

```bash
$ docker build -t libra-ui-v1 .
```

#### Docker run

```bash
$ docker run --name libra-ui -d -p 3000:3000 libra-ui-v1
```

```bash
$ docker network connect milvus libra-ui
```
