let db = [];
let dbFelid = {
    cunit: 'cunit', objectNest: 'objectNest', htmlCTIlList: 'htmlCTIlList', Totalunixtime: 'Totalunixtime',
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
    cliitem[cliitem.length - 1].insertAdjacentHTML("afterend", get(dbFelid.htmlCTIlList));
    //ctillist.innerHTML = ctillist.innerHTML + get(dbFelid.htmlCTIlList);
    loader1();
}

function reduceElementOnClick(cti) {
    let ctillist = document.querySelector('.calculate-time-input-list');
    if (ctillist.children.length === 1) return false;
    //ctillist.children[ctillist.children.length - 1].remove();
    cti.remove();
    loader1();
}

/**
 *
 * @returns string
 */
function getFormat(r) {
    let fcase = get(dbFelid.cunit);
    switch (fcase) {
        case 's':
            return "%i% 秒".replace("%i%", BigInt(r));

        case 'm':
            return "%i% 分鐘".replace("%i%", BigInt(r) / BigInt(60));

        case 'h':
            return "%i% 小時".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60));

        case 'd':
            return "%i% 天".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24));

        case 'w':
            return "%i% 週".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(7));

        case 'TenDayPeriod':
            return "%i% 旬".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(10));

        case 'M':
            return "%i% 月".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(30));

        case 'S':
            return "%i% 季".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(90));

        case 'y':
            return "%i% 年".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(365));

        case "Decade":
            return "%i% 年代(秩)".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(365) / BigInt(10));

        case "Generation":
            return "%i% 世".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(365) / BigInt(30));

        case "SexagenaryCycle":
            return "%i% 甲子".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(365) / BigInt(60));

        case "Century":
            return "%i% 世紀".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(365) / BigInt(100));

        case "Millennium":
            return "%i% 千紀、千年".replace("%i%", BigInt(r) / BigInt(60) / BigInt(60) / BigInt(24) / BigInt(365) / BigInt(1000));

        default:
            return "%i% 秒".replace("%i%", r);

    }
}

function countAll() {
    let total = "0";
    for (let obj of get(dbFelid.objectNest)) {
        //console.log(obj);
        let start = obj.startTimeElement.value;
        let startSec = obj.startTimeSecondElement.value;
        let end = obj.endTimeElement.value;
        let endSec = obj.endTimeSecondElement.value;
        //console.log(typeof startSec, typeof endSec)
        if (start === "" || start === null) continue;
        if (end === "" || end === null) continue;
        //console.log(1)
        let s0001 = BigInt(TimeAdapter(start)) + BigInt(startSec);
        let startunix = s0001 | BigInt("0");
        let s0002 = BigInt(TimeAdapter(end)) + BigInt(endSec);
        let endunix = s0002 | BigInt("0");
        //console.log(s0001,startunix,s0002,endunix);
        //console.log(startSec,endSec);
        let r;
        if (startunix > endunix) {
            r = BigInt(startunix) - BigInt(endunix);
        } else {
            r = BigInt(endunix) - BigInt(startunix);
        }
        //console.log(r);
        obj.timeCounterElement.innerText = getFormat(r);
        total = BigInt(total) + BigInt(r);
        console.log(total);
    }
    //console.log(getFormat(total));
    document.querySelector("#total_html").innerText = getFormat(total);
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function daysInMonth(year, month) {
    const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month - 1];
}

function loader1() {
    let ctil = document.querySelectorAll('.calculate-time-input-list .cli-item');
    //console.log(ctil);
    let objects = [];
    let key = 0;
    for (let cti of ctil) {
        //console.log(cti.children);
        let object = {
            key: key,
            ctiElement: cti,
            startTimeElement: cti.children[0].children[1],
            startTimeSecondElement: cti.children[0].children[2],
            endTimeElement: cti.children[1].children[1],
            endTimeSecondElement: cti.children[1].children[2],
            timeCounterElement: cti.children[2],
            addElement: cti.children[3].children[0],
            reduceElement: cti.children[3].children[1], //counterElement: cti.children[4],
        };
        object.addElement.onclick = addElementOnClick;
        object.reduceElement.onclick = ()=>{
            reduceElementOnClick(cti);
        };
        //object.counterElement.onclick = ()=>{
        //    counterElementOnClick(object, key);
        //};
        objects.push(object);
        key++;
    }
    set(dbFelid.objectNest, objects);
    //console.log(get(dbFelid.objectNest));
}

function loader2() {
    let cunit = document.querySelector(".calculate-unit");
    if (cunit !== null) {
        cunit.onchange = () => {
            //console.log(cunit.value);
            set(dbFelid.cunit, cunit.value);
        };
    }
}

function TimeAdapter(datetimeInput) {
    if (datetimeInput) {
        const [date, time] = datetimeInput.split('T');
        const [year, month, day] = date.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);
        //console.log(datetimeInput);
        let days = 0;

        // 計算從1970年1月1日到所選年份的天數
        for (let y = 1970; y < year; y++) {
            days += daysInYear(y);
        }

        // 計算當年從1月到所選月份的天數
        for (let m = 1; m < month; m++) {
            days += daysInMonth(year, m);
        }

        // 加上當月的天數
        days += day - 1;

        // 計算總秒數
        return BigInt(days.toString()) * BigInt("86400") + BigInt(hour.toString()) * BigInt("3600") + BigInt(minute.toString()) * BigInt("60");
    }
    return null;
}

function getSecondsOption() {
    let h = "";
    for (let i = 0; i <= 59; i++) {
        h += `<option>${i}</option>` + "\n";
    }
    return h;
}

function secondsInit() {
    let s = document.querySelectorAll(".seconds");
    let shtml = getSecondsOption();
    for (let sElement of s) {
        sElement.innerHTML = shtml;
    }
}

document.onchange = () => {
    try {
        countAll();
    } catch (e) {
        if (e.name === "RangeError") {
            alert("已經超出瀏覽器的計算極限。");
        }
        console.log(typeof e);
        console.log(e);
    }
};

function load() {
    loader1();
    loader2();
    secondsInit();
    set(dbFelid.htmlCTIlList, document.querySelector(".calculate-time-input-list").innerHTML);
}

document.addEventListener('DOMContentLoaded', load);
