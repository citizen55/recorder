
const UI = {

    createControlRecorder: function(parent, width) {
        let btnRecord, btnPause, btnResume, btnStop;

        btnRecord =  this.createButton('Start',  ['btn', 'btn-danger', 'btn-sm']);
        btnPause =  this.createButton('Pause',  ['btn', 'btn-primary', 'btn-sm']);
        btnResume = this.createButton('Resume', ['btn', 'btn-primary', 'btn-sm']);
        btnStop =   this.createButton('Stop',   ['btn', 'btn-danger', 'btn-sm']);

        let col = document.createElement('div');
        col.classList.add('mx-auto');
        col.setAttribute('style', 'width:' + width + 'px;');
        col.appendChild(btnRecord);
        col.appendChild(btnPause);
        col.appendChild(btnResume);
        col.appendChild(btnStop);

        this.createWrap(parent, col, {cssCol: ['col-12'], cssRow: ['row', 'pt-4']});

        return {
            btnRecord,
            btnPause,
            btnResume,
            btnStop
        }
    },

    createContainerForReceivedAudio(parent){
        let row = document.createElement('div');
        row.classList.add('row');

        let container = document.createElement('div');
        container.setAttribute('id', 'audiocontainer');
        container.classList.add('col-12');

        row.appendChild(container);
        parent.appendChild(row);
        return container;
    },

    showReceivedAudioView(container, width){
        let audio = document.createElement('audio');
        audio.setAttribute('controls', '');
        audio.controls = true;

        this.createWrap(container, audio, {
            cssCol: ['pt-3', 'mx-auto'],
            cssRow: ['row'],
            attrCol: {
                'style': 'width:' + width + 'px;'
            }
        });

        let link = document.createElement('a');
        link.innerHTML = 'Download';
        link.classList.add('btn', 'btn-primary', 'btn-sm');
        link.download = 'file.mp3';

        let btnEdit = document.createElement('button');
        btnEdit.innerHTML = 'Edit';
        btnEdit.classList.add('btn', 'btn-primary', 'btn-sm', 'ml-1');
        btnEdit.setAttribute('id', 'edit');
        btnEdit.setAttribute('type', 'button');

        this.createWrap(container, [link, btnEdit],
            {
                cssCol: ['mx-auto'],
                cssRow: ['row'],
                attrCol: {
                    'style': 'width:' + this.width + 'px;'
                }
            }
        );

        return {audio, link, btnEdit};
    },

    createVisualiserView(container, width, height){
        let row = document.createElement('div');
        row.classList.add('row');
        container.insertAdjacentElement("afterbegin", row);

        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.setAttribute('id', 'canvas');
        canvas.setAttribute('style', 'border-bottom: 1px solid black; border-top: 2px solid darkgray;');
        canvas.classList.add('mx-auto');
        row.insertAdjacentElement('afterbegin', canvas);

        return canvas;
    },

    createButton( name, cssClasses) {
        let btn = document.createElement('button');
        if(cssClasses instanceof Array){
            for(let item = 0; item < cssClasses.length; item++){
                btn.classList.add(cssClasses[item]);
            }
        }else{
            btn.classList.add('btn');
        }
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', name);
        btn.innerHTML = name;
        return btn;
    },

    createWrap(parent, childs, prop) {

        let row = document.createElement('div');
        let col = document.createElement('div');

        if(prop instanceof Object){
            if(prop.cssCol != undefined){

                for(let item = 0; item < prop.cssCol.length; item++){
                    col.classList.add(prop.cssCol[item]);
                }
            }
            if(prop.cssRow != undefined){
                for(let item = 0; item < prop.cssRow.length; item++){
                    row.classList.add(prop.cssRow[item]);
                }
            }
            if(prop.attrCol != undefined){
                for(let key in prop.attrCol){
                    col.setAttribute(key, prop.attrCol[key]);
                }
            }
            if(prop.attrRow != undefined){
                for(let key in prop.attrRow){
                    row.setAttribute(key, key.value);
                }
            }

        }else if(prop instanceof Array){
            for(let item = 0; item < prop.length; item++){
                col.classList.add(prop[item]);
            }
        }else{
            col.classList.add('col-12');
            row.classList.add('row');
        }

        //if(!parent) debugger;

        row.appendChild(col);
        parent.appendChild(row);

        if(childs instanceof Array){
            for(let child = 0; child < childs.length; child++){
                col.appendChild(childs[child]);
            }
        }else{
            col.appendChild(childs);
        }

        return true;
    },

}

export {UI};