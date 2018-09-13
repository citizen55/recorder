# Audio recorder

# EN

# RU

Используется:
 - библиотека lamejs https://github.com/zhuker/lamejs;
 - webpack 4
 - для загрузки в стиле ES6 worker-loader
 - для стилизации рекордера используются Bootstrap библиотека
 и другое


HTML разметка
    <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
    ...
<body>
    <div class="container">
        <section id="webrecorder" class="pt-4">
            <div class="row pt-4" id="control">
                <div class="col-12" >
                    <button class="btn btn-outline-danger"  type="button" id="record">Record</button>
                    <button class="btn btn-outline-primary" type="button" id="pause">Pause</button>
                    <button class="btn btn-outline-primary" type="button" id="resume">Resume</button>
                    <button class="btn btn-outline-danger"  type="button" id="stop">Stop</button>
                </div>
            </div>
        </section>
    </div>
    <script src="dist/bandle.js"></script>
</body>