var pollid;
var candList;
var candNum;
var totalVotes;
var intervalId;
var breakOn = false;

//var r = new Array(candNum).fill('0');

var cand = 'candidates';
var remVot = 'remainingVotes';
var totVot = 'totalVotes';
var candVot = 'votesPerCandidates';
var pollRes = 'pollResult';
var polls = 'polls'

var address = '0xc3e5ad11ae2f00c740e74b81f134426a3331d950';
//var address = '0x8466e6e218f0fe438ac8f403f684451d20e59ee3';
var myinstance = [
    {
        "inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],
        "name":"candidates",
        "outputs":[{"internalType":"string[]","name":"","type":"string[]"}],
        "stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],
        "name":"remainingVotes",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],
        "name":"totalVotes",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],
        "name":"votesPerCandidates",
        "outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],
        "stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],
        "name":"pollResult",
        "outputs":[{"components":[
            {"internalType":"string","name":"candidate","type":"string"},
            {"internalType":"uint256","name":"votes","type":"uint256"}
        ],"internalType":"struct Governor.Tally[]","name":"","type":"tuple[]"}],
        "stateMutability":"view","type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "name":"polls",
        "outputs":[
            {"internalType":"string","name":"title","type":"string"},
            {"internalType":"uint256","name":"startAt","type":"uint256"},
            {"internalType":"uint256","name":"due","type":"uint256"},
            {"internalType":"uint256","name":"minimumCOMO","type":"uint256"},
            {"internalType":"uint256","name":"totalVotedCOMO","type":"uint256"},
            {"internalType":"uint256","name":"revealedVotes","type":"uint256"},
            {"internalType":"bool","name":"finalized","type":"bool"}
        ],
        "stateMutability":"view","type":"function"
    }
];

var mylist = new new Web3Eth(new Web3HttpProvider("https://polygon-rpc.com")).Contract(myinstance,address).methods;

// [
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pollId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"burned","type":"uint256"}],"name":"Finalized","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"PollCreated","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pollId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"revealedVotes","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"remainingVotes","type":"uint256"}],"name":"Revealed","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},
//     {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pollId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"voteIndex","type":"uint256"},{"indexed":false,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"comoAmount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"Voted","type":"event"},
//     {"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
//     {"inputs":[],"name":"OPERATOR_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
//     ▶{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},
//     {"inputs":[],"name":"comoContract","outputs":[{"internalType":"contract IERC777Upgradeable","name":"","type":"address"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"string","name":"title_","type":"string"},{"internalType":"string[]","name":"candidates_","type":"string[]"},{"internalType":"uint256","name":"startAt_","type":"uint256"},{"internalType":"uint256","name":"due_","type":"uint256"},{"internalType":"uint256","name":"minimumCOMO_","type":"uint256"}],"name":"createPoll","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"finalize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"hashes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"address","name":"voteSignerAddress_","type":"address"},{"internalType":"address","name":"comoAddress_","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"isInProgress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"isRevealedVote","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
//     ▶{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"pollResult","outputs":[{"components":[{"internalType":"string","name":"candidate","type":"string"},{"internalType":"uint256","name":"votes","type":"uint256"}],"internalType":"struct Governor.Tally[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
//     ▶{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"polls","outputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"uint256","name":"startAt","type":"uint256"},{"internalType":"uint256","name":"due","type":"uint256"},{"internalType":"uint256","name":"minimumCOMO","type":"uint256"},{"internalType":"uint256","name":"totalVotedCOMO","type":"uint256"},{"internalType":"uint256","name":"revealedVotes","type":"uint256"},{"internalType":"bool","name":"finalized","type":"bool"}],"stateMutability":"view","type":"function"},
//     ▶{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"remainingVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"},{"internalType":"uint256","name":"missingOffset","type":"uint256"},{"components":[{"internalType":"uint256","name":"comoAmount","type":"uint256"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"internalType":"struct Governor.CommitData[]","name":"missingCommitData","type":"tuple[]"}],"name":"reset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"},{"components":[{"internalType":"uint256","name":"votedCandidateId","type":"uint256"},{"internalType":"bytes32","name":"salt","type":"bytes32"}],"internalType":"struct Governor.RevealData[]","name":"data","type":"tuple[]"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"reveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"setVoteSignerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
//     ▶{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"userData","type":"bytes"},{"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"tokensReceived","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"totalVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userVoteResults","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
//     {"inputs":[],"name":"voteSignerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"voters","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"votes","outputs":[{"components":[{"internalType":"uint256","name":"comoAmount","type":"uint256"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"internalType":"struct Governor.CommitData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
//     ▶{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"votesPerCandidates","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"}
// ];

function p(l) {
    console.log(l)
}

function sum(array) {
    var s = 0
    for (i=0;i<candNum;i++) {
        s += array[i]
    }
    return s
}

async function read(item) {
    const res = await mylist[item](pollid).call({from: '0x0000000000000000000000000000000000000000'});
    return res;
}
// pollid : String

async function variableSetting() {
    input('pollid') ? pollid = input('pollid') : breakOn = true;
    if (breakOn) {
        alert('Poll ID를 입력해주세요')
        return
    } else {
        candList = await read(cand);
        candNum = await candList.length;
        totalVotes = await read(totVot)
    }
}

async function start() {
    $('#status').text('집계 중')
    await variableSetting()
    if (breakOn) {
        breakOn = false
        $('#status').text('대기 중')
        return
    }

    l=[]
    intervalId = setInterval(() => lpush(), 2000);
}

async function lpush() {
    var ws = await read(candVot)
    ws = ws.join()
    if (!(l.includes(ws))) {
        l.push(ws)
    }

    chart(ws)
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = 0
        $('#status').text('대기 중')
        $('#that').append("<hr>")
        for (item of l) {
            $('#that').append(`<p>${item}</p>`)
        }
    } else {
        alert('집계 중이지 않습니다.')
    }
}

async function chart(ed) {
    var ln=[]
    var edl = ed.split(',')
    for (item of edl) {
        ln.push(parseInt(item)/(10**18))
    }
    // console.log("Engineered "+Math.round(ln[0])+" "+"▩".repeat(Math.round(ln[0]/250))+"▦".repeat(Math.round(ln[1]/250))+" "+Math.round(ln[1])+" Dreamy")
    
    //that.innerHTML = "School Sqaud "+Math.round(ln[0])+" "+"▩".repeat(Math.round(ln[0]/250))+"▦".repeat(Math.round(ln[1]/250))+" "+Math.round(ln[1])+" Engineered";
    var rem = await read(remVot)
    var barLength = await ( 1 - rem / totalVotes ) * 100

    if (await barLength < 0) {
        barLength = 0
    }
    await $('#that').empty().append(`<div style="height:20px;background-color:#555;position:relative">
    <div style="height:20px;background-color:#6e2cff;width:${ barLength }%">
</div></div>`)

    for (i=0; i<candNum; i++) {
        $('#that').append("<p>"+"■".repeat(Math.round(ln[i]/800))+` ${Math.round(ln[i])} ${candList[i]}</p>`);
    }
    console.log(sum(ln))
    if (await rem == 0) {
        let ws = await read(candVot)
        ws = ws.join()
        if (!(l.includes(ws))) {
            l.push(ws)
        }
        stop()
    }
    //후보당 4만~5만 정도 득표할 때 사용하기 좋은 상태.
}

/*function topRank() {
    var rawVoteList = read(listVot,pollid);
    var voteList = [];

    for (i=0;i<rawVoteList.length;i++) {
        var como = parseInt(rawVoteList[i][0])/(10**18);
        if (como > 9) {
            voteList.push([como,i])
        }
    }
    voteList.sort(function(a, b) {
        return b[0] - a[0];
    })
    for (i=0; i<voteList.length; i++) {
        $('#that').append("<p>"+voteList[i][0]+"<span> "+rawVoteList[voteList[i][1]][1]+"</p>")
    }
}*/
// start()
