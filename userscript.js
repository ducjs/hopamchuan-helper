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


let isOnlyLevel = false;
let isHideLyric = false;
let isShowLevel = false;

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
        "4,3,2,1", "4,3,2,5,1", "4,3,6,2,5,1",// Lùi
        "4,3,6,2,3,6", // Lùi thứ
        "2,3,2,3,2,2,5", "1,6,2,4,3,6,2,2,5,1",  // Lần cuối
        "1,3,6,2,5", "1,3,6,5,4,2,5", "1,3,6,5,4,3,6,2,5", //Giấc mơ có thật
        "1,5,6,3,4,1,4,5", "1,5,6,3,4,1,3,6,2,5", "1,5,6,3,4,1,3,6,2,5,1", "1,5,6,3,4,5,3,6,4,2,5", // Canon
        "1,3,6,3,4,2,5,4,5", "1,3,6,3,4,2,5,2,5", "1,3,6,3,4,1,2,5", // Canon 3
        "1,3,6,3,2,6,4,5", "1,3,6,3,2,6,5,6", "1,3,3,6,4,1,2,3", "1,3,3,6,4,5", // Người tình mùa đông
        "4,5,3,6,2,5,1", "4,5,3,6,4,5,1", "",
        "1,6,4,1", // MĐS
        "1,6,6,2,4,4", // Thằng điên,
        "1,3,6,5,1,4,2,5", "1,3,6,4,1,4,2,5",
        "6,5,4"
    ],
    MINOR: [
        "6,7,5,1", "6,7,5,1,6,7,3", "6,7,5,1,6,7,3,3", "6,7,5,1,6,5,1" // Tháng tư
    ]
}
// Dùng some để biết nó loại gì

const genLevel = () => {
    var sel = document.getElementById("tool-box-trans-adj");
    var rootKey = sel.options[sel.selectedIndex].text.substr(0, 2).trim();
    let rootChords = chordList[rootKey]
    let keys = document.getElementsByClassName("hopamchuan_chord")

    for (let key of keys) {
        let bac = rootChords.indexOf(key.innerText.replace("m", ""))
        let bacDiv = `<div class="chord-level" style="color:blue;display: none;">|${bac + 1}</div>`
        key.innerHTML = `${key.innerText}${bacDiv}`
    }
}

const onOnlyLevel = () => {
    var sel = document.getElementById("tool-box-trans-adj");
    var rootKey = sel.options[sel.selectedIndex].text.substr(0, 2).trim();
    let rootChords = chordList[rootKey]
    let keys = document.getElementsByClassName("hopamchuan_chord")

    for (let key of keys) {
        let bac = rootChords.indexOf(key.innerText.replace("m", ""))
        let bacDiv = `<div class="chord-level" style="color:blue;display: inline-block;">${bac + 1}</div>`
        key.innerHTML = `${bacDiv}`
    }
    onHideLyric()
}

const onHideLevel = () => {
    let levels = document.getElementsByClassName("chord-level")
    isShowLevel = !isShowLevel
    for (let level of levels) {
        level.style.display = isShowLevel ? 'inline-block' : 'none'
    }
}

const onHideLyric = () => {
    let lyrics = document.getElementsByClassName("hopamchuan_lyric")
    isHideLyric = !isHideLyric
    for (let lyric of lyrics) {
        lyric.style.display = isHideLyric ? 'none' : 'inline'
    }
}

const analyze = () => {
    let chords = document.querySelectorAll("#song-lyric .pre > .chord_lyric_line .hopamchuan_chord");
    let i = chords.length - 1;

    let chordsName = [];
    for (let chord of chords) {
        chordsName.push(chord.innerText)
    };

    // let chordsName = ['D', 'Bm', 'G', 'D', 'D', 'Bm', 'G', 'D',
    //   'D', 'Bm', 'G', 'D', 'D', 'Bm', 'G', 'D', 'D', 'Bm', 'G', 'D', 'D', 'Bm', 'G', 'D'
    // ]
    // console.log(chordsName);

    let maxDepth = 12;
    let chordMap = {};

    let currentDepth = 0;

    for (let i = 0; i < chordsName.length; i++) {
        let tail = i + maxDepth;
        for (let y = i; y < tail; y++) {
            if (y === chordsName.length) break;
            let combine = chordsName.slice(i, y + 1);
            combine = JSON.stringify(combine)
            if (chordMap[combine]) {
                chordMap[combine].divs.push(chords[i]);
                chordMap[combine].tailDivs.push(chords[y]);
                chordMap[combine].count = chordMap[combine].count + 1
            } else {
                chordMap[combine] = {
                    divs: [chords[i]],
                    tailDivs: [chords[y]],
                    // endDivs : [chords[]],
                    count: 1,
                    combine
                }
            }
        }

    }
    currentDepth = 0;
    parseLevel(chordMap);

}

const parseLevel = (chordMap) => {
    let selectedIndex = document.querySelector("#tool-box-trans-adj").selectedIndex;
    let root = document.querySelectorAll("#tool-box-trans-adj option")[selectedIndex].getAttribute("data-key");
    // root = root.replace(/maj7|m|7/g, "")
    let isMinor = false;
    if (root.includes("m")) isMinor = true;
    let chordProgressionMapping = isMinor ? CHORD_PROGRESSION.MINOR : CHORD_PROGRESSION.MAJOR

    let rootMap = chordList[root]
    console.log("root", root, rootMap)
    //TODO: is major or minor
    for (let [k, v] of Object.entries(chordMap)) {
        let combine = JSON.parse(k);
        let combineChord = genChordCombine(combine, rootMap);
        if (chordProgressionMapping.indexOf(combineChord) >= 0) {
            console.log("combine", combineChord)
            let divs = v.divs;
            let tailDivs = v.tailDivs;
            for (let i = 0; i < divs.length; i++) {
                let div = divs[i];
                let tail = tailDivs[i];
                console.log("div", div)
                console.log("tail", tail)
                div.style.backgroundColor = "rgb(255 230 145)"
                tail.style.backgroundColor = "#a0ffee"
                // let songDiv = document.querySelector("#song-lyric");

                let parentNode = div.parentNode
                // console.log("parentNode", parentNode)
                let progressionNote = genProgressionNote(combineChord);
                // parentNode.appendChild(progressionNote)

                parentNode.insertBefore(progressionNote, parentNode.firstChild);

            }
        }
    }
}
const genChordCombine = (combine, rootMap) => {
    return combine.map(i => {
        let note = i.replace("m", "");
        // if(note === "G") console.log("NOte",  rootMap.indexOf(note))
        return rootMap.indexOf(note) + 1;
    }).join(",");;
}

const genProgressionNote = (text = "") => {
    const noteDiv = document.createElement("button");
    noteDiv.innerText = text;
    noteDiv.classList.add('rhythm-item');

    noteDiv.style.border = "1px dashed #969696";
    noteDiv.style.maxWidth = "120px";
    noteDiv.style.backgroundColor = "#fffce0";
    // noteDiv.style.marginTop = "20px";
    // noteDiv.classList.add('song-lyric-note');
    return noteDiv

}

// const parseLevel = (chordMap) => {
//     // let root = document.querySelector("#tool-box-trans-adj > option:nth-child(1)").text;
//     let selectedIndex = document.querySelector("#tool-box-trans-adj").selectedIndex;
//     let root = document.querySelectorAll("#tool-box-trans-adj option")[selectedIndex].getAttribute("data-key");
//     // root = root.replace(/maj7|m|7/g, "")
//     let isMinor = false;
//     if (root.includes("m")) isMinor = true;
//     let rootMap = chordList[root]
//     console.log("root", root, rootMap)
//     //TODO: is major or minor
//     for (let [k, v] of Object.entries(chordMap)) {
//         let combine = JSON.parse(k);
//         combine = combine.map(i => {
//             let note = i.replace("m", "");
//             // if(note === "G") console.log("NOte",  rootMap.indexOf(note))
//             return rootMap.indexOf(note) + 1;
//         }).join(",");;
//         // console.log("combine", combine)
//         let chordProgressionMapping = isMinor ? CHORD_PROGRESSION.MINOR : CHORD_PROGRESSION.MAJOR
//         if (chordProgressionMapping.indexOf(combine) >= 0) {
//             console.log(combine, v)
//         }
//     }
// }

setTimeout(() => {
    enableGopDong();
    disableChordView();
}, 500)

setTimeout(() => {
    analyze();
}, 1000)

const disableChordView = () => {
    document.getElementById('chord-view').style.opacity = 0;
}

const enableGopDong = () => {
    if (!document.getElementById("tool-box-easy-toggle").classList.contains('on')) document.getElementById("tool-box-easy-toggle").click();
}


