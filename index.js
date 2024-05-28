let db = [];
let dbFelid = {
    cunit: 'cunit',
    objectNest: 'objectNest',
    htmlCTIlList: 'htmlCTIlList',
    Totalunixtime: 'Totalunixtime',
};

function getByDefault(key, _default) {
    if (db.hasOwnProperty(key)) {
        return db[key];
    } else {
        return _default;
    }
}

function get(key) {
    if (db.hasOwnProperty(key)) {
        return db[key];
    } else {
        return null;
    }
}

function set(key, value) {
    db[key] = value;
}

function has(key) {
    if (db.hasOwnProperty(key)) {
        return true;
    } else {
        return false;
    }
}

function addElementOnClick() {
    let cliitem = document.querySelectorAll('.calculate-time-input-list .cli-item');
    cliitem[cliitem.length-1].insertAdjacentHTML("afterend", get(dbFelid.htmlCTIlList));
    //ctillist.innerHTML = ctillist.innerHTML + get(dbFelid.htmlCTIlList);
    loader1();
}

function reduceElementOnClick(){
    let ctillist = document.querySelector('.calculate-time-input-list');
    if(ctillist.children.length === 1) return false;    
    ctillist.children[ctillist.children.length-1].remove();
    loader1();
}

/**
 * 
 * @returns string
 */
function getFormat(r){
    let fcase = get(dbFelid.cunit);
    switch (fcase) {
        case 's':
            return "%i% 秒".replace("%i%", r);
            break;
        case 'm':
            return "%i% 分".replace("%i%", r/60);
            break;
        case 'h':
            return "%i% 時".replace("%i%", r/60/60);
            break;
        case 'd':
            return "%i% 天".replace("%i%", r/60/60/24);
            break;
        default:
            return "%i% 秒".replace("%i%", r);
            break;
    }
}

function countAll(){
    let total = 0;
    for (let obj of get(dbFelid.objectNest)) {
        //console.log(obj);
        let start = obj.startTimeElement.value;
        let end = obj.endTimeElement.value;
        if(start === "" || start === null) continue;
        if(end === "" || end === null) continue;
        let startunix = new Date(start).getTime()/1000|0;
        let endunix = new Date(end).getTime()/1000|0;
        let r ;
        if(startunix > endunix){
            r = startunix - endunix;
        }else{
            r = endunix - startunix;
        }
        total += r;
    }
    //console.log(getFormat(total));
    document.querySelector("#total_html").innerText = getFormat(total);
}

function counterElementOnClick(object, key){
    let start = object.startTimeElement.value;
    let end = object.endTimeElement.value;
    let startunix = new Date(start).getTime()/1000|0;
    let endunix = new Date(end).getTime()/1000|0;
    let r ;
    if(startunix > endunix){
        r = startunix - endunix;
    }else{
        r = endunix - startunix;
    }
    object.timeCounterElement.innerText = getFormat(r);
}

function loader1() {
    let ctil = document.querySelectorAll('.calculate-time-input-list .cli-item');
    console.log(ctil);
    let objects = [];
    let key = 0;
    for (let cti of ctil) {
        let object = {
            key: key,
            timeunix: 0,
            ctiElement: cti,
            startTimeElement: cti.children[0].children[1],
            endTimeElement: cti.children[1].children[1],
            timeCounterElement: cti.children[2],
            addElement: cti.children[3].children[0],
            reduceElement: cti.children[3].children[1],
            counterElement: cti.children[4],
        };
        object.addElement.onclick = addElementOnClick;
        object.reduceElement.onclick = reduceElementOnClick;
        object.counterElement.onclick = ()=>{
            counterElementOnClick(object, key);
        };
        objects.push(object);
        key++;
    }
    set(dbFelid.objectNest, objects);
    console.log(get(dbFelid.objectNest));
}

function loader2() {
    let cunit = document.querySelector(".calculate-unit");
    if (cunit !== null) {
        cunit.onchange = () => {
            console.log(cunit.value);
            set(dbFelid.cunit, cunit.value);
        };
    }
}

setInterval(() => {
    countAll();
}, 3000);

function load() {
    loader1();
    loader2();
    set(dbFelid.htmlCTIlList, document.querySelector(".calculate-time-input-list").innerHTML);
}

document.addEventListener('DOMContentLoaded', load);