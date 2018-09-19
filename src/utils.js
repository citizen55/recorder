
// create a wrapeer from DOM Elements with classes Bootstrap 4
let DOMHelper = {
    createWrap: function (parent, childs, prop) {

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
    }
}

export {DOMHelper};