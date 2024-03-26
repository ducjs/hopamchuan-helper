// ==UserScript==
// @name         Hopamchuan Helper
// @namespace    Music
// @version      0.5
// @description  Thêm bậc cho hợp âm
// @author       You
// @match        https://hopamchuan.com/song/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439495/Hopamchuan%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/439495/Hopamchuan%20Helper.meta.js
// ==/UserScript==

// Sliding windows
// Overlap

// Highlight hợp âm chưa hiện diện tiếp theo ở combine button
// Group màu các nhóm chung
// Tổng hợp các nhóm hợp âm

let isShowLevel = false;
let regRemoveColor = /maj|m|sus|aug|dim|7|2|4|6|9|11/g
const CONFIG = {
    COMBINES: {
        BG_COLOR: "rgb(100 195 255 / 26%)"
    }
};
let displayMode = "chord"; // chord, level

const chordList = {
    'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'B'],
    'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],

    'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'D#': ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'],
    'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],

    'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],

    'F': ['F', 'G', 'A', 'A#', 'C', 'D', 'E'],
    'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'],
    'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],

    'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    'G#': ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'],
    'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],

    'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    'A#': ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'],
    'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],

    'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],

    'Am': ['A', 'B', 'C', 'D', 'E', 'F', 'G',],
    'A#m': ['A#', 'B#', 'C#', 'D#', 'F', 'F#', 'G#',],
    'Bm': ['B', 'C#', 'D', 'E', 'F#', 'G', 'A', 'B',],
    'Cm': ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#', 'C',],
    'C#m': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B', 'C#',],
    'Dm': ['D', 'E', 'F', 'G', 'A', 'A#', 'C', 'D',],
    'D#m': ['D#', 'F', 'F#', 'G#', 'A#', 'B', 'C#', 'D#',],
    'Em': ['E', 'F#', 'G', 'A', 'B', 'C', 'D', 'E',],
    'Fm': ['F', 'G', 'G#', 'A#', 'C', 'C#', 'D#', 'F',],
    'F#m': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E', 'F#',],
    'Gm': ['G', 'A', 'A#', 'C', 'D', 'D#', 'F', 'G',],
    'G#m': ['G#', 'A#', 'B', 'C#', 'D#', 'F', 'F#', 'G#']
}

let CHORD_PROGRESSION = {
    MAJOR: [
        "4,5,6", "4,5,6,3", // Nơi này có anh 
        "2,5,1,6",
        "1,5,6,4", // QQ
        "1,5,6,3", "4,1,2,5", "6,3,4,2,5", "2,5,1",// Khi cô đơn
        "1,3,6", "4,5,1", "4,5,3,6", "2,4,5", // không cần phải hứa
        "1,5,6,3,4,5,3,6,4,5",
        "4,3,2,1", "4,3,2,5,1", "4,3,6,2,5,1",// Lùi
        "4,3,6,2,3,6", // Lùi thứ
        "1,4,5,1,4,1,0,5", "5,1,4",// Nàng thơ
        "2,3,2,3,2,2,5", "1,6,2,4,3,6,2,2,5,1",  // Lần cuối
        // "1,3,6,2,5",
        "1,3,6,5,4,2,5", "1,3,6,5,4,3,6,2,5", "1,3,6,5,0", "1,3,6,5,4,1,2,5", //Giấc mơ có thật
        "1,5,6,3,4,1,4,5", "1,5,6,3,4,1,3,6,2,5", "1,5,6,3,4,1,3,6,2,5,1", "1,5,6,3,4,5,3,6,4,2,5", // Canon
        "1,3,6,3,4,2,5,4,5", "1,3,6,3,4,2,5,2,5", "1,3,6,3,4,1,2,5", // Canon 3
        "1,3,6,3,2,6,4,5", "1,3,6,3,2,6,5,6", "1,3,3,6,4,1,2,3", "1,3,3,6,4,5", // Người tình mùa đông
        "4,5,3,6", "4,5,3,6,4,5,1", "",
        "1,6,4,1", // MĐS
        "1,6,6,2,4,4", "3,6,2,4", // Thằng điên,
        "1,3,6,5,1,4,2,5", "1,3,6,4,1,4,2,5",
        "6,5,4",
        "1,1,1,", "4,4,1", "2,0,1", "2,5,3,6", // Can't take,
        "2,5,1,4", "2,3,6", "2,5,6", // Giữa đại lộ
        "1,6,2,5", "3,6,2,5", "1,6,2,4,1", "4,1,6,2,4,5" //Đưa em về nhà
    ],
    MINOR: [
        "6,7,5,1", "6,5,1", "6,7,3", "6,7,1", // Tháng tư
        "1,5,1,5", "1,5,6,7,1", "1,7,1,7", "1,7,6,7,1", // Chờ người nơi ấy
        "6,5,4,5,1",
        "1,4,6", "1,3,4", // Em oii
        "1,3,7,1", "1,3,4,1", "3,4,3,7,1", //Bước đến bên em,
        "1,5,6,3", "4,1,6,5", "1,5,6,5", "1,5,6,5,6,4", "6,4,0,5", // Chỉ là không cùng nhau,
        "1,5,4,5,1", "1,5,4,7,3", "4,5,1",// Ngày mai lấy chồng
        "1,3,7,4", // Bốn chữ lắm,
        "1,4,0,5", //Careless,
        "1,5,7,4,6,3", //Hotel
        "1,6,3,0",
        "4,7,5,1,4,5", "4,7,3,6", "4,0,5", // Vài lần đón đưa
        "1,4,7,3", "1,4,5,1", "4,7,5", // Giá như Noo
        "1,4,7,3,6,4,2,5" //Fly me

    ]
}
// Dùng some để biết nó loại gì
let chordLyricDivs = [];
let maxDepth = 12;

const initAnalyze = () => {
    lyricsAndChordsIndexer();

    let { rootNote, isMinor, rootMap } = getRootNote();
    let chordsName = getAllChord(rootMap);
    let chordProgressionMapping = isMinor ? CHORD_PROGRESSION.MINOR : CHORD_PROGRESSION.MAJOR;

    // Get match chord combines
    let matchCombineChord = getChordsMatchProg(chordsName, rootMap, chordProgressionMapping);
    let combineChordsSort = sortCombineChords(matchCombineChord);
    // console.log(combineChordsSort)

    for (let combineChords of combineChordsSort) {
        let combineChordLevelStr = genChordLevelCombineStr(combineChords, rootMap);
        let combineChordsString = genChordCombineStr(combineChords, rootMap);
        let chordHeadIndex = Number(combineChords[0].index);
        let chordTailIndex = Number(combineChords[combineChords.length - 1].index);

        let chordHeadDiv = document.querySelectorAll(`[helper-index="${chordHeadIndex}"]`);
        if (!chordHeadDiv.length) continue;
        chordHeadDiv = chordHeadDiv[0];

        let genedLength = chordHeadDiv.getAttribute("gened");
        genedLength = genedLength !== null ? Number(genedLength) : -1;
        if (
            genedLength >= 0
            && genedLength >= combineChordsString.length
        ) continue;

        markCombineGened(chordHeadIndex, chordTailIndex, combineChordsString.length);
        genHelperChordAndLevelDiv(chordHeadDiv, combineChordsString, combineChordLevelStr);
        coloringCombineLines(chordHeadIndex, chordTailIndex);
    }
    helperCombine_summaryAtHead();
    styling_combineGroupColor();

}

const helperCombine_summaryAtHead = () => {
    let summaryMap = {};
    let summaryArrForSort = [];

    let combineDivs = document.querySelectorAll(`[level]`);
    for (let div of combineDivs) {
        let level = div.getAttribute("level");
        let chord = div.getAttribute("chord");
        if (!summaryMap[level]) {
            summaryMap[level] = {
                div: genHelperNoteDiv(chord, level),
                count: 1
            };
        } else {
            summaryMap[level].count = summaryMap[level].count + 1;
        }
    }
    for (let key of Object.keys(summaryMap)) {
        summaryArrForSort.push([key, summaryMap[key].count])
    }
    summaryArrForSort = summaryArrForSort.sort((a, b) => a[1] - b[1])

    console.log("summaryArrForSort", summaryArrForSort);

    let lyricDiv = document.querySelector("#song-lyric > div");
    for (let [level, count] of summaryArrForSort) {
        let div = summaryMap[level].div;
        div.innerText = `${div.innerText}: ${count}`;
        lyricDiv.insertBefore(div, lyricDiv.firstChild);
    }
    // for (let key of Object.keys(summaryMap)) {
    //     let div = summaryMap[key].div;
    //     lyricDiv.insertBefore(div, lyricDiv.firstChild);
    // }
    console.log("div", summaryMap);
    // genHelperNoteDiv
}

const styling_combineGroupColor = () => {
    let defaultColor = "rgb(231 231 231)";
    let colors = ["rgb(255, 252, 224)", "rgb(255 227 224)", "rgb(255 224 253)", "#d3f5518c", "#51f5b68c", "#ff9d3d8c"];
    let colorMap = {};

    let combineDivs = document.querySelectorAll(`[level]`);
    for (let div of combineDivs) {
        let level = div.getAttribute("level");
        if (!colorMap[level]) {
            colorMap[level] = colors.shift();
        } else if (!colors.length) {
            colorMap[level] = defaultColor
        }
        div.style.backgroundColor = colorMap[level];
    }



}

const getChordsMatchProg = (chordsName, rootMap, chordProgressionMapping) => {
    let matchCombineChords = [];
    for (let i = 0; i < chordsName.length; i++) {
        let tail = i + maxDepth;

        for (let y = i; y < tail; y++) {
            if (y === chordsName.length) break;
            let combineChords = chordsName.slice(i, y + 1);
            let combineChordLevelStr = genChordLevelCombineStr(combineChords, rootMap);
            const MATCH_PROG = chordProgressionMapping.indexOf(combineChordLevelStr) >= 0;
            if (!MATCH_PROG) continue;
            matchCombineChords.push(combineChords)
        }

    }
    return matchCombineChords;
}

const getAllChord = (rootMap) => {
    let chordsName = [];
    let chords = document.querySelectorAll("#song-lyric .pre .chord_lyric_line");
    for (let chord of chords) {
        let chordNameTextDivs = chord.querySelectorAll(".hopamchuan_chord") || [];
        if (!chordNameTextDivs.length) continue;
        for (let div of chordNameTextDivs) {
            let noteName = div.innerText;
            // console.log({ noteName })
            let level = getNoteLevelByName(noteName, rootMap);
            chordsName.push({
                name: noteName,
                level,
                index: div.getAttribute("helper-index"),

            });
        };

    };
    return chordsName;
}

const handleOnClickChangeTone = () => {
    document.querySelector("#tool-box-trans-up").addEventListener("click", deleteAllHelperCombine);
    document.querySelector("#tool-box-trans-down").addEventListener("click", deleteAllHelperCombine);
}

const deleteAllHelperCombine = () => {
    let helperCombines = document.querySelectorAll(".helper-chord-combine");
    for (let div of helperCombines) {
        div.parentNode.removeChild(div);
    }
    let gened = document.querySelectorAll(`[gened]`);
    for (let div of gened) {
        div.removeAttribute("gened");
    }
    // console.log(gened)
    // initAnalyze();
}

const sortCombineChords = (combineChordsSort) => {
    combineChordsSort = combineChordsSort.sort((a, b) => b.length - a.length || a.level - b.level);
    return combineChordsSort;

}

const markCombineGened = (headIndex, tailIndex, length) => {
    // console.log({ headIndex, tailIndex, length });

    for (let i = headIndex; i <= tailIndex; i++) {
        let div = chordLyricDivs[i];
        div.setAttribute("gened", length)
    }
}

const coloringCombineLines = (headIndex, tailIndex) => {
    // console.log({ headIndex, tailIndex });

    for (let i = headIndex; i <= tailIndex; i++) {

        let div = chordLyricDivs[i];
        div.style.backgroundColor = CONFIG.COMBINES.BG_COLOR;

        let chordDiv = div.querySelector(".hopamchuan_chord");
        if (chordDiv) {
            chordDiv.style.color = "blue";
        }
        // div.style.borderTop = "1px dashed #969696";
        // div.style.borderBottom = "1px dashed #969696";
    }
}

const genHelperChordAndLevelDiv = (chordHeadDiv, text, combineChordLevelStr) => {
    let progressionNote = genHelperNoteDiv(text, combineChordLevelStr);
    chordHeadDiv.insertBefore(progressionNote, chordHeadDiv.firstChild);
}

const genHelperNoteDiv = (text = "", combineChordLevelStr) => {
    const noteDiv = document.createElement("button");
    noteDiv.innerText = text;
    noteDiv.classList.add('rhythm-item');
    noteDiv.classList.add('helper-chord-combine');
    noteDiv.setAttribute("level", combineChordLevelStr);
    noteDiv.setAttribute("chord", text);
    noteDiv.style.border = "1px dashed #969696";
    noteDiv.style.fontSize = "13px";
    // noteDiv.style.maxWidth = "120px";
    noteDiv.style.marginLeft = "5px";
    noteDiv.style.backgroundColor = "#fffce0";
    noteDiv.onclick = () => {
        let helperCombines = document.querySelectorAll(".helper-chord-combine");
        for (let div of helperCombines) {
            let level = div.getAttribute("level");
            let chord = div.getAttribute("chord");
            if (displayMode === "chord") {
                div.innerText = level;
            }
            if (displayMode === "level") {
                div.innerText = chord;
            }
        }
        displayMode = displayMode === "level" ? "chord" : "level";


    }
    // noteDiv.style.marginTop = "20px";
    // noteDiv.classList.add('song-lyric-note');
    return noteDiv;

}

const lyricsAndChordsIndexer = () => {
    for (let i = 0; i < chordLyricDivs.length; i++) {
        let div = chordLyricDivs[i];

        const IS_PERSON_NOTE = div.parentNode?.parentNode?.classList[0] === "song-lyric-note" || false;
        if (IS_PERSON_NOTE) continue;

        div.setAttribute("helper-index", i);
        let chordDivs = div.querySelectorAll(".hopamchuan_chord");
        if (chordDivs.length) {
            for (let div of chordDivs) {
                div.setAttribute("helper-index", i);
            }
        }
    };
}

const getRootNote = () => {
    let selectedIndex = document.querySelector("#tool-box-trans-adj").selectedIndex;
    let rootNote = document.querySelectorAll("#tool-box-trans-adj option")[selectedIndex].getAttribute("data-key");
    rootNote = rootNote.replace(/maj7|7/g, "")
    let isMinor = false;
    if (rootNote.includes("m")) isMinor = true;
    let rootMap = chordList[rootNote];

    console.log({ rootNote, rootMap });

    return { rootNote, isMinor, rootMap }
}

const getNoteLevelByName = (note, rootMap) => {
    note = note.replace(regRemoveColor, "");
    if (note.includes("/")) {
        note = note.charAt(note.length - 1);
    }
    return rootMap.indexOf(note) + 1;
}

const genChordLevelCombineStr = (combine, rootMap) => {
    return combine.map(i => {
        let note = i.name.replace(regRemoveColor, "");
        if (note.includes("/")) {
            note = note.charAt(note.length - 1);
        }
        return rootMap.indexOf(note) + 1;
    }).join(",");;
}

const genChordCombineStr = (combine) => {
    return combine.map(i => {
        let note = i.name.replace(regRemoveColor, "");
        return note;
    }).join(",");;
}


const onShowLevel = () => {
    let levels = document.getElementsByClassName("chord-level")
    isShowLevel = !isShowLevel
    for (let level of levels) {
        level.style.display = isShowLevel ? 'inline-block' : 'none'
    }
}

const genLevel = () => {
    var sel = document.getElementById("tool-box-trans-adj");
    var rootKey = sel.options[sel.selectedIndex].text.substr(0, 2).trim();
    let rootChords = chordList[rootKey];
    let keys = document.getElementsByClassName("hopamchuan_chord");

    for (let key of keys) {
        let note = key.innerText;

        note = note.replace(regRemoveColor, "");
        if (note.includes("/")) {
            note = note.charAt(note.length - 1);
        }
        let level = rootChords.indexOf(note) + 1
        let bacDiv = `<div class="chord-level" style="color:blue;display: none;">|${level}</div>`
        key.innerHTML = `${key.innerText}${bacDiv}`
    }
}


const initShowLevel = () => {
    const genDiv = document.createElement("button");
    genDiv.innerText = "Hiện bậc"
    genDiv.classList.add('rhythm-item');
    genDiv.onclick = onShowLevel
    document.getElementById("song-author").appendChild(genDiv);
}

const initProgressionHelperButton = () => {
    const genDiv = document.createElement("button");
    genDiv.innerText = "Hiện tiến trình"
    genDiv.classList.add('rhythm-item');
    genDiv.onclick = initAnalyze
    document.getElementById("song-author").appendChild(genDiv);
}

setTimeout(() => {
    enableGopDong();
    disableChordView();
    disableChiaCot();
}, 500)

setTimeout(() => {
    chordLyricDivs = document.querySelectorAll(".hopamchuan_lyric, .hopamchuan_chord_inline");

    initShowLevel();
    // onShowLevel();
    genLevel();

    initProgressionHelperButton();
    initAnalyze();

    handleOnClickChangeTone();

}, 1000)

const disableChordView = () => {
    document.getElementById('chord-view').style.opacity = 0;
}

const disableChiaCot = () => {
    if (document.querySelector("#tool-box-column-toggle").classList.contains('on')) document.querySelector("#tool-box-column-toggle").click();
}

const enableGopDong = () => {
    if (!document.getElementById("tool-box-easy-toggle").classList.contains('on')) document.getElementById("tool-box-easy-toggle").click();
}
