// ==UserScript==
// @name         Hopamchuan Helper
// @namespace    Music
// @version      0.1
// @description  Thêm bậc cho hợp âm
// @author       You
// @match        https://hopamchuan.com/song/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// ==/UserScript==

// Highlight hợp âm chưa hiện diện tiếp theo ở combine button
// Group màu các nhóm chung

let isShowLevel = false;
let regRemoveColor = /maj|m|sus|aug|dim|7|2|4|6|9|11/g
const CONFIG = {
    COMBINES: {
        BG_COLOR: "rgb(100 195 255 / 26%)"
    }
};

const chordList = {
    'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'B'],
    'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],

    'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'D#': ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'],
    'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],

    'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],

    'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
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
        "2,5,1,6",
        "1,5,6,4", // QQ
        "1,5,6,3", "4,1,2,5", "6,3,4,2,5", "2,5,1",// Khi cô đơn
        "1,3,6", "4,5,1", "4,5,3,6", "2,4,5", // không cần phải hứa
        "1,5,6,3,4,5,3,6,4,5",
        "4,3,2,1", "4,3,2,5,1", "4,3,6,2,5,1",// Lùi
        "4,3,6,2,3,6", // Lùi thứ
        "1,4,5,1,4,1,0,5", // Nàng thơ
        "2,3,2,3,2,2,5", "1,6,2,4,3,6,2,2,5,1",  // Lần cuối
        // "1,3,6,2,5",
        "1,3,6,5,4,2,5", "1,3,6,5,4,3,6,2,5", "1,3,6,5,0", "1,3,6,5,4,1,2,5", //Giấc mơ có thật
        "1,5,6,3,4,1,4,5", "1,5,6,3,4,1,3,6,2,5", "1,5,6,3,4,1,3,6,2,5,1", "1,5,6,3,4,5,3,6,4,2,5", // Canon
        "1,3,6,3,4,2,5,4,5", "1,3,6,3,4,2,5,2,5", "1,3,6,3,4,1,2,5", // Canon 3
        "1,3,6,3,2,6,4,5", "1,3,6,3,2,6,5,6", "1,3,3,6,4,1,2,3", "1,3,3,6,4,5", // Người tình mùa đông
        "4,5,3,6", "4,5,3,6,4,5,1", "",
        "1,6,4,1", // MĐS
        "1,6,6,2,4,4", // Thằng điên,
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
        "1,6,3,0"

    ]
}
// Dùng some để biết nó loại gì
let chordLyricDivs = [];

const initAnalyze = () => {
    lyricsAndChordsIndexer();

    let { rootNote, isMinor } = getRootNote();
    let rootMap = chordList[rootNote];
    console.log({ rootNote, rootMap });

    let chords = document.querySelectorAll("#song-lyric .pre .chord_lyric_line");
    let chordsName = [];
    for (let chord of chords) {
        let chordNameTextDivs = chord.querySelectorAll(".hopamchuan_chord") || [];
        if (!chordNameTextDivs.length) continue;
        for (let div of chordNameTextDivs) {
            let noteName = div.innerText;
            console.log({noteName})
            let level = getNoteLevelByName(noteName, rootMap);
            chordsName.push({
                name: noteName,
                level,
                index: div.getAttribute("helper-index"),

            });
        };

    };

    let maxDepth = 12;


    let chordProgressionMapping = isMinor ? CHORD_PROGRESSION.MINOR : CHORD_PROGRESSION.MAJOR;
    let overlapMap = [];
    let combineChordsSort = []
    // Sliding windows
    // Overlap
    /* Loop từng window
        Chỉ lọc lấy những nhóm hợp ấm khớp với prog, lấy kèm index
    */

    for (let i = 0; i < chordsName.length; i++) {
        let tail = i + maxDepth;

        for (let y = i; y < tail; y++) {
            if (y === chordsName.length) break;
            let combineChords = chordsName.slice(i, y + 1);
            let combineChordLevelStr = genChordLevelCombineStr(combineChords, rootMap);
            const MATCH_PROG = chordProgressionMapping.indexOf(combineChordLevelStr) >= 0;
            if (!MATCH_PROG) continue;
            combineChordsSort.push(combineChords)
        }

    }
    console.log(combineChordsSort)
    combineChordsSort = combineChordsSort.sort((a, b) => b.length - a.length && a.level - b.level);

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
            //  && genedLength > combineChordsString.length
             ) continue;

        markCombineGened(chordHeadIndex, chordTailIndex, combineChordsString.length);


        genHelperChordAndLevelDiv(chordHeadDiv, combineChordsString);

        coloringCombineLines(chordHeadIndex, chordTailIndex);
    }

}

const isOverlap = () => {

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

const genHelperChordAndLevelDiv = (chordHeadDiv, text) => {
    let progressionNote = genHelperNoteDiv(text);
    chordHeadDiv.insertBefore(progressionNote, chordHeadDiv.firstChild);
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

    return { rootNote, isMinor }
}

const getNoteLevelByName = (note, rootMap) => {
    note = note.replace(regRemoveColor, "");
    return rootMap.indexOf(note) + 1;
}

const genChordLevelCombineStr = (combine, rootMap) => {
    return combine.map(i => {
        let note = i.name.replace(regRemoveColor, "");
        return rootMap.indexOf(note) + 1;
    }).join(",");;
}

const genChordCombineStr = (combine) => {
    return combine.map(i => {
        let note = i.name.replace(regRemoveColor, "");
        return note;
    }).join(",");;
}


const genHelperNoteDiv = (text = "") => {
    const noteDiv = document.createElement("button");
    noteDiv.innerText = text;
    noteDiv.classList.add('rhythm-item');

    noteDiv.style.border = "1px dashed #969696";
    noteDiv.style.fontSize = "13px";
    // noteDiv.style.maxWidth = "120px";
    noteDiv.style.marginLeft = "5px";
    noteDiv.style.backgroundColor = "#fffce0";

    // noteDiv.style.marginTop = "20px";
    // noteDiv.classList.add('song-lyric-note');
    return noteDiv;

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
    let rootChords = chordList[rootKey]
    let keys = document.getElementsByClassName("hopamchuan_chord")

    for (let key of keys) {
        let bac = rootChords.indexOf(key.innerText.replace(regRemoveColor, ""))
        let bacDiv = `<div class="chord-level" style="color:blue;display: none;">|${bac + 1}</div>`
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

setTimeout(() => {
    enableGopDong();
    disableChordView();
    disableChiaCot();
}, 500)

setTimeout(() => {
    chordLyricDivs = document.querySelectorAll(".hopamchuan_lyric, .hopamchuan_chord_inline");
    initAnalyze();

    initShowLevel();
    genLevel();
    onShowLevel();

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









