var pollid;
var candList;
var candNum;
var totalVotes;
var intervalId;
var breakOn = false;
var address;
var mylist;
var voteFinish = false;

//var r = new Array(candNum).fill('0');

var cand = 'candidates';
var remVot = 'remainingVotes';
var totVot = 'totalVotes';
var candVot = 'votesPerCandidates';
var pollRes = 'pollResult';
var polls = 'polls'

var addressObj = {'tripleS':'0xc3e5ad11ae2f00c740e74b81f134426a3331d950','ARTMS':'0x8466e6e218f0fe438ac8f403f684451d20e59ee3'};
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
    // var s = 0
    // for (i=0;i<candNum;i++) {
    //     s += array[i]
    // }
    return eval(array.map(v=>v[1]).join("+"))
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
        // address = '0xc3e5ad11ae2f00c740e74b81f134426a3331d950';
        address = addressObj[input('addressSelect')];
        mylist = await new new Web3Eth(new Web3HttpProvider("https://polygon-rpc.com")).Contract(myinstance,address).methods;
        candList = await read(cand);
        candList = candList.map(v=>{return v.replaceAll('\b','')})
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
    var pollInfo = await read(polls)
    var endDt = parseInt(pollInfo.due)*1000
    var intervalId1 = setInterval(async ()=>{
        var dt = new Date()*1
        if (endDt < dt) {
            clearInterval(intervalId1)
            totalVotes = await read(totVot)
            totalComo = Math.round(pollInfo.totalVotedCOMO/10**18)
            voteFinish = true
        }
    },100)
    l=[]
    intervalId = setInterval(() => lpush(), 2000);
}

async function lpush() {
    if (!voteFinish) {return undefined}
    var ws = await read(candVot)
    // ws = ws.join()
    if (!(l.includes(ws.join()))) {
        l.push(ws.join())
    }

    chart(ws)
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = 0
        $('#status').text('대기 중')
        $('#that').append("<hr>")
        // for (item of l) {
        //     $('#that').append(`<pre>${item}</p>`)
        // }
        $('#that').append(`<pre>${l.join('\n')}</pre>`)
    } else {
        alert('집계 중이지 않습니다.')
    }
}

async function chart(ed) {
    $('#that').empty().append('<div style="background:black;color:#fff" class="gravityResultDiv"></div>')
    var ln = candList.map(v=>{
        var index = candList.indexOf(v)
        var count = Math.round(ed[index]/10**18)
        return [v,count]
    }).sort((x,y)=>y[1]-x[1])
    // ed.map(v=>{return Math.round(v/10**18)})
    // var ed = ed.split(',')
    // for (item of ed) {
    //     ln.push(parseInt(item)/(10**18))
    // }
    // console.log("Engineered "+Math.round(ln[0])+" "+"▩".repeat(Math.round(ln[0]/250))+"▦".repeat(Math.round(ln[1]/250))+" "+Math.round(ln[1])+" Dreamy")
    
    //that.innerHTML = "School Sqaud "+Math.round(ln[0])+" "+"▩".repeat(Math.round(ln[0]/250))+"▦".repeat(Math.round(ln[1]/250))+" "+Math.round(ln[1])+" Engineered";
    var rem = await read(remVot)
    var barLength1 = ( 1 - rem / totalVotes ) * 100

    if (barLength1 < 0) {
        barLength1 = 0
    }
    $('.gravityResultDiv').empty().append(`<div style="margin: 10px 0px; color: #fff; height: 25px; position:relative; background: linear-gradient(to right, #6e2cff ${barLength1}%, #555 ${barLength1}%)">${comma(totalVotes - rem)}/${comma(totalVotes)} Votes (${barLength1.toFixed(1)}%)</div>`)
    
    var currentComo = sum(ln)
    var barLength2 = currentComo/totalComo*100
    $('.gravityResultDiv').append(`<div style="margin: 10px 0px 30px; color: #fff; height:25px; position:relative; background: linear-gradient(to right, #6e2cff ${barLength2}%, #555 ${barLength2}%)">${comma(currentComo)}/${comma(totalComo)} COMO (${barLength2.toFixed(1)}%)</div>`)
    //     await $('.gravityResultDiv').empty().append(`<div style="height:20px;background-color:#555;position:relative">
    //     <div style="height:20px;background-color:#6e2cff;width:${ barLength }%">
    // </div></div>`)
    
    ln.forEach(element => {
        var percent = element[1]/ln[0][1]*100
        $('.gravityResultDiv').append(`<div style="margin: 10px 0px; color: #fff; height:25px; position:relative; background: linear-gradient(to right, #6e2cff ${percent}%, #555 ${percent}%)">${element[0]} ${comma(element[1])} (${(element[1]/totalComo*100).toFixed(1)}%)</div>`)
    });
    // for (i=0; i<candNum; i++) {
        // Math.round(ln[i])
        // const barLength2 = ln[i]
        // $('.gravityResultDiv').append("<p>"+"■".repeat(Math.round(ln[i]/800))+` ${Math.round(ln[i])} ${candList[i]}</p>`);
        // $('.gravityResultDiv').append("<p>"+"■".repeat(Math.round(ln[i]/800))+` ${Math.round(ln[i])} ${candList[i]}</p>`);
    // }
    console.log(sum(ln))
    if (rem == 0) {
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
        $('.gravityResultDiv').append("<p>"+voteList[i][0]+"<span> "+rawVoteList[voteList[i][1]][1]+"</p>")
    }
}*/
// start()
