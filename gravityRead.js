var pollid;
var candList;
var candNum;
var totalVotes;
var intervalId=0;
var breakOn = false;
var address;
var mylist;
var voteFinish = false;
var totalComo = 0;

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
    var s = 0
    for (i=0;i<array.length;i++) {
        s += array[i].como
    }
    return s
    // return eval(array.map(v=>v[1]).join("+"))
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
        // console.log(123)
        candNum = await candList.length;
        totalVotes = await read(totVot)
    }
}

async function start() {
    async function chart(vpc) {
        // console.log(candElements)
        candElements.forEach(o=>o.como=Math.round(vpc[o.index]/10**18))
        const sortedCands = candElements.sort((x,y)=>y.como-x.como)
        sortedCands.forEach((o,rank)=>{
            var percent = o.como/sortedCands[0].como*100
            o.element.style.transform=`translateY(${(rank-o.index)*35}px)`
            o.element.querySelector('div').style.width=`${percent}%`
            o.element.querySelector('span').innerText=`${o.name} ${o.como.toLocaleString()} (${totalComo?(o.como/totalComo*100).toFixed(1):'0.0'}%)`
        })
    
        // var rem = 1000
        var rem = await read(remVot)
        var barLength1 = ( 1 - rem / totalVotes ) * 100
        if (barLength1 < 0) {
            barLength1 = 0
        }
        votesProgress.querySelector('div').style.width = `${barLength1}%`
        votesProgress.querySelector('span').innerText = `${(totalVotes - rem).toLocaleString()}/${parseInt(totalVotes).toLocaleString()} Votes (${barLength1.toFixed(1)}%)`
        
        var currentComo = sum(candElements)
        var barLength2 = totalComo?currentComo/totalComo*100:0
        comoProgress.querySelector('div').style.width = `${barLength2}%`
        comoProgress.querySelector('span').innerText = `${currentComo.toLocaleString()}/${totalComo.toLocaleString()} COMO (${barLength2.toFixed(1)}%)`
        
        var guaranteed = Math.floor((totalComo-currentComo-sortedCands[0].como+sortedCands[1].como)/2+1)
        if (guaranteed>0) guaranteeProgress.innerText = `${sortedCands[0].name}의 당선 확정까지 남은 COMO : ${Math.max(guaranteed,0)}`
        else guaranteeProgress.innerText = `${sortedCands[0].name} 당선`
        
        // console.log(sum(ln))
        if (currentComo >= totalComo && totalComo) {
            // let ws = await read(candVot)
            // ws = ws.join()
            stop()
        }
    }

    if (intervalId) {
        clearInterval(intervalId)
        intervalId = 0
    }
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
            var asvd = await read(polls)
            totalComo = Math.round(asvd.totalVotedCOMO/10**18)
            voteFinish = true
        }
    },100)
    // l=[]
    const gravityResultDiv = document.createElement('div')
    gravityResultDiv.classList.add('gravityResultDiv')
    $('#that').empty().append(gravityResultDiv)

    const votesProgress = document.createElement('div')
    const comoProgress = document.createElement('div')
    const guaranteeProgress = document.createElement('div')
    const voteSpan = document.createElement('span')
    const voteBar = document.createElement('div')
    const comoSpan = document.createElement('span')
    const comoBar = document.createElement('div')
    votesProgress.classList.add('gravityLine')
    comoProgress.classList.add('gravityLine')
    voteSpan.innerText=`0/${totalVotes.toLocaleString()} Votes (0.0%)`
    votesProgress.append(voteSpan,voteBar)
    comoProgress.style.marginBottom='30px'
    comoSpan.innerText=`0/${totalComo.toLocaleString()} COMO (0.0%)`
    comoProgress.append(comoSpan,comoBar)
    guaranteeProgress.style.backgroundColor='transparent'
    guaranteeProgress.classList.add('gravityLine')
    gravityResultDiv.append(votesProgress,comoProgress,guaranteeProgress)
    const candElements=candList.map((c,index)=>(
        {
            "index":index,
            "name":c,
            "element":document.createElement('div')
        }
    ))
    // console.log(456)
    candElements.forEach(o=>{
        const span = document.createElement('span')
        const bar = document.createElement('div')
        span.innerText = `${o.name} 0 (0.0%)`
        // bar.style.backgroundColor="#6e2cff"
        // bar.style.width="0%"
        // bar.classList.add('gravity-bar')
        o.element.style.backgroundColor="#555"
        o.element.classList.add("gravityLine","gravity-candidate")
        o.element.append(span,bar)
        gravityResultDiv.append(o.element)
    })
    // vpc = new Array(7).fill(10**19)
    // vpc 
    intervalId = setInterval(async () => {
        if (!voteFinish) {return undefined}
        var vpc = await read(candVot)
        chart(vpc)
    }, 2000);
}

// async function lpush() {
//     if (!voteFinish) {return undefined}
//     var ws = await read(candVot)

//     chart(ws)
// }

function stop() {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = 0
        $('#status').text('대기 중')
        // $('#that').append("<hr>")
        // for (item of l) {
        //     $('#that').append(`<pre>${item}</p>`)
        // }
        // $('#that').append(`<pre>${l.join('\n')}</pre>`)
    } else {
        alert('집계 중이지 않습니다.')
    }
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
