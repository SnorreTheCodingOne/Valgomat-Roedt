var currentq = 0,
    q = [
        "Vi må ta vare på de som ikke kan ta vare på seg selv.",
        "Karakterer er en bra måte å vurdere elever.",
        "Vi bør finansiere nye endringer ved bruk av bompenger.",
        "Man skal ikke få en dårligere vurdering for mye fravær, det bør bestemmes basert på elevens kunnskap.",
        "Vi gjør nokk for å hindre mobbing.",
        "Tannlegetjenesten bør være gratis i en lengre periode enn før.",
        "Arbeid bør være viktigere enn å arve mye.",
        "Man bør ha rett på fast jobb hvis man vil.",
        "Asylsøkere skal ikke ha lov til å jobbe mens de venter på svar.",
        "EØS-avtalen bør beholdes.",
        "Kapitalinntekt bør skattes mer.",
        "Bemanningsselskap er greie å ha.",
        "Hvis man har behov for det, bør man kunne pensjonere seg fra man er 62 år."
    ],
    rodtCur = [true, false, false, true, false, true, true, true, false, false, true, false, true],
    userCur = [],
    inProgress = false;
console.log(window.innerWidth + " | " + window.innerHeight)
console.log(window.outerWidth + " | " + window.outerHeight)
async function nextQ() {
    console.log(currentq)
    if(inProgress) return
    inProgress = true
    var qText = document.getElementById("qText"),
        yes = document.getElementById("yes"),
        no = document.getElementById("no"),
        progText = document.getElementById("progText");
        document.getElementById("qButton").value = "Neste"
    getInput(yes, no)
    await fade()


    qText.innerHTML = q[currentq]
    adjustCSSRules("input, label", "display:inline")
    adjustCSSRules("#meter", "visibility:visible")
    for (var i = parseInt((100 / (q.length) * (currentq-1)).toFixed(0));i<=parseInt((100 / (q.length) * (currentq)).toFixed(0));i++) {
        progText.style.width = i + "%"
        await sleep(15)
    }
    currentq++
    if (currentq == q.length+1) {
        adjustCSSRules("input, label", "display:none")
        document.getElementById("qButton").value = "Prøv Igjen"
        qText.innerHTML = `Takk for at du brukte vår valgomat.<br>Du er ${calcPerc(rodtCur, userCur)} enig med Rødt parti.<br><img src="./RodtLogo.png" width="50%"><br>`
    } else if(currentq == q.length+2){
        currentq=0
        userCur = []
        document.getElementById("valgomat").innerHTML = `<h1>Start valgomat</h1>
        <div id="qText">
            <img src="./RodtLogo.png" width="50%"><br>
        </div>
        <label for="yes"><input type="radio" id="yes" name="quest"> Enig</label>
        <label for="no"><input type="radio" id="no" name="quest"> Uenig</label>
        <input type="submit" id="qButton" onclick="nextQ()" value="Start">
        <div id="meter" class="meter">
            <span id="progText" style="width:0%"></span>
        </div>`
        adjustCSSRules("input, label", "display:none")
        adjustCSSRules("#meter", "visibility:hidden")
    }
    else {
        adjustCSSRules("input, label", "display:inline")
    }


    await sleep(250)
    fadeIn()
    inProgress = false
}

function getInput(y, n) {
    if (y.checked) {
        userCur.push(true)
    } else if (n.checked) {
        userCur.push(false)
    } else if (getComputedStyle(y).display != "none") {
        userCur.push(null)
    }
    y.checked = false
    n.checked = false
}

function calcPerc(rodt, user) {
    var sim = 0
    for (var i = -1; i < q.length; i++) {
        if (rodt[i] == user[i] && i != -1) {
            sim++
        }
    }
    return ((100 / (rodt.length) * sim).toFixed(1) + "%")
}

async function fade() {
    for (var i = 100; i >= 0; i-=2) {
        adjustCSSRules('#qText', 'opacity: ' + i + "%");
        await sleep(5)
    }
}

async function fadeIn() {
    for (var i = 0; i <= 100; i+=2) {
        adjustCSSRules('#qText', 'opacity: ' + i + "%");
        await sleep(5)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('keydown', logKey);
function logKey(e) {
    console.log(e.code);
    if(e.code == "ArrowUp" || e.code == "Digit1") {
        var yes = document.getElementById("yes")
        yes.checked = true
    } else if(e.code == "ArrowDown" || e.code == "Digit2") {
        var no = document.getElementById("no")
        no.checked = true
    } else if(e.code == "Enter") {
        nextQ()
    }
  }


//Function by SamGoody on StackOverflow
function adjustCSSRules(selector, props, sheets) {

    // get stylesheet(s)
    if (!sheets) sheets = [...document.styleSheets];
    else if (sheets.sup) { // sheets is a string
        let absoluteURL = new URL(sheets, document.baseURI).href;
        sheets = [...document.styleSheets].filter(i => i.href == absoluteURL);
    } else sheets = [sheets]; // sheets is a stylesheet

    // CSS (& HTML) reduce spaces in selector to one.
    selector = selector.replace(/\s+/g, ' ');
    const findRule = s => [...s.cssRules].reverse().find(i => i.selectorText == selector)
    let rule = sheets.map(findRule).filter(i => i).pop()

    const propsArr = props.sup ?
        props.split(/\s*;\s*/).map(i => i.split(/\s*:\s*/)) // from string
        :
        Object.entries(props); // from Object

    if (rule)
        for (let [prop, val] of propsArr) {
            // rule.style[prop] = val; is against the spec, and does not support !important.
            rule.style.setProperty(prop, ...val.split(/ *!(?=important)/));
        }
    else {
        sheet = sheets.pop();
        if (!props.sup) props = propsArr.reduce((str, [k, v]) => `${str}; ${k}: ${v}`, '');
        sheet.insertRule(`${selector} { ${props} }`, sheet.cssRules.length);
    }
}