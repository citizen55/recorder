
// create a wrapeer from DOM Elements with classes Bootstrap 4
let DOMHelper = {
    createWrap: function (parent, childs, cssClasses) {

        let row = document.createElement('div');
        row.classList.add('row');
        let col = document.createElement('div');

        if(cssClasses instanceof Array){
            for(let item = 0; item < cssClasses.length; item++){
                col.classList.add(cssClasses[item]);
            }
        }else{
            col.classList.add('col-12');
        }


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
    }
}

export {DOMHelper};