var pollid;
var candList;
var candNum;
var totalVotes;
var intervalId=0;
var breakOn = false;
var mylist;
var voteFinish = false;
var totalComo = 0;

const abi = [
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"remainingVotesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"totalVotesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"votesPerCandidates","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"}
]
const rpc = "https://api.mainnet.abs.xyz"
const address = "0xF1A787da84af2A6e8227aD87112a21181B7b9b39"
const provider = new ethers.JsonRpcProvider(rpc)
const contract = new ethers.Contract(address, abi, provider)

var cand = 'candidates';
var remVot = 'remainingVotesCount';
var totVot = 'totalVotesCount';
var candVot = 'votesPerCandidates';

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
    const res = await contract[item]("1",pollid)
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
        // address = addressObj[input('addressSelect')];
        // mylist = await new new Web3Eth(new Web3HttpProvider("https://polygon-rpc.com")).Contract(myinstance,address).methods;
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
        candElements.forEach(o=>{
            const tempcomo=Math.round(vpc[o.index]/10**18)
            if (tempcomo > o.prevComo) o.como = tempcomo
            o.prevComo = tempcomo
        })
        const sortedCands = candElements.sort((x,y)=>y.como-x.como)
        sortedCands.forEach((o,rank)=>{
            // if (o.como < o.prevComo) return 0
            var percent = o.como/sortedCands[0].como*100
            o.element.style.transitionDuration='0.5s'
            o.element.style.transform=`translateY(${(rank-o.currRank)*35}px)`
            o.currRank=rank
            o.element.querySelector('div').style.width=`${percent}%`
            o.element.querySelector('span').innerText=`${o.name} ${o.como.toLocaleString()} (${totalComo?(o.como/totalComo*100).toFixed(1):'0.0'}%)`
        })
        setTimeout(()=>{
            sortedCands.forEach(i=>{
                const e=i.element
                e.style.transitionDuration='0s'
                e.style.transform='translateY(0px)'
                e.parentElement.appendChild(e)
            })
        },510)
    
        // var rem = 1000
        var rem = await read(remVot)
        console.log(rem,prevRem)
        if (rem == prevRem-100) {
            var barLength1 = ( 1 - rem / totalVotes ) * 100
            if (barLength1 < 0) {
                barLength1 = 0
            }
            prevRem = rem
            votesProgress.querySelector('div').style.width = `${barLength1}%`
            votesProgress.querySelector('span').innerText = `${(totalVotes - rem).toLocaleString()}/${parseInt(totalVotes).toLocaleString()} Votes (${barLength1.toFixed(1)}%)`
        }
        
        var currentComo = sum(candElements)
        if (currentComo > prevTotal) {
            prevTotal = currentComo
            var barLength2 = totalComo?currentComo/totalComo*100:0
            comoProgress.querySelector('div').style.width = `${barLength2}%`
            comoProgress.querySelector('span').innerText = `${currentComo.toLocaleString()}/${totalComo.toLocaleString()} COMO (${barLength2.toFixed(1)}%)`
        }
        
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
    // var pollInfo = await read(polls)
    // var endDt = parseInt(pollInfo.due)*1000
    // var intervalId1 = setInterval(async ()=>{
    //     var dt = new Date()*1
    //     if (endDt < dt) {
    //         clearInterval(intervalId1)
    //         totalVotes = await read(totVot)
    //         var asvd = await read(polls)
    //         totalComo = Math.round(asvd.totalVotedCOMO/10**18)
    //         voteFinish = true
    //     }
    // },100)
    // l=[]
    var prevRem = parseInt(await read(remVot)) + 100
    var prevTotal = 0
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
    voteSpan.innerText=`0/${parseInt(totalVotes).toLocaleString()} Votes (0.0%)`
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
            "currRank": index,
            "name":c,
            "element":document.createElement('div'),
            "prevComo": 0
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
