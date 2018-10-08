# Web dictophone

### EN

### RU

Используется:
 - библиотека lamejs https://github.com/zhuker/lamejs;
 - webpack 4
 - для загрузки в стиле ES6 worker-loader
 - для стилизации рекордера используются Bootstrap библиотека
 и другое


HTML разметка
```html
    <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
    ...
<body>
    <div class="container">
        <section id="webrecorder" class="pt-4">
        </section>
    </div>
    <script src="dist/bandle.js"></script>
    <script> Recorder.create(
        {
            container: 'webrecorder',
            recorder: {
              width: 250
            },
            visualiser: {
                show: true,
                width: 250,
                height: 70
            }
            /*visualiser: {
                show: false
            } */
        }
    ); </script>
</body>
```
