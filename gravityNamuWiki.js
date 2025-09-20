function comma(num) {
  return num.toLocaleString('ko-KR')
  // var numString = String(num)
  // var len = numString.length
  // var fregments = []
  // for (i=0;i<len;i+=3) {
  //   fregments.unshift(numString.slice(-3-i,len-i))
  // }
  // var freg = fregments.join()
  // if (numString.length < 4) {
  //   var freg = numString
  // } else if (numString.length < 7) {
  //   var freg = [numString.slice(0,-3),numString.slice(-3)].join()
  // } else {
  //   var freg = [numString.slice(0,-6),numString.slice(-6,-3),numString.slice(-3)].join()
  // }
  // return freg
}

function gravityResult(pollResult) {
  // for (item of pollResult) {
  //   item.votesInt = parseInt(item)
  // }
  // console.log(pollResult)
  
  const sorted = pollResult.map((v,i)=>{return {'cand':candList[i],'como':parseInt(v)}}).sort((a,b)=>b.como-a.como)
  
  var sum = 0
  for (item of sorted) {
    sum += item.como
  }
  
  var max = sorted[0].como
  for (item of sorted) {
    item.barPercent = Math.round( 1000 * item.como / max ) / 10
    item.votesComma = comma(item.como)
    let pcnt = String( Math.round( 1000 * item.como / sum ) / 10 )
    if (pcnt.length < 3) {
      pcnt += '.0'
    }
    item.votesPercent = pcnt
  }
  
  var text = `{{{#!wiki style="word-break: keep-all"
||<tablewidth=100%><tablebordercolor=#000,#fff><tablebgcolor=#fff,#1f2023><bgcolor=#000> '''{{{#fff Event Gravity Result}}}''' ||
||<nopad> {{{#!wiki style="min-height: 25px"
{{{#!folding [ 펼치기 · 접기 ]
{{{#!wiki style="margin: -6px -1px -11px"
||<tablewidth=100%><tablebgcolor=#fff,#1f2023><rowbgcolor=#000><rowcolor=#gold,#gold><width=50%> '''후보''' ||<width=50%> '''득표율''' ||
|| '''{{{#gold,#gold ${sorted[0].cand}}}}''' ||<nopad> {{{#!wiki style="margin: 10px 0px; padding: 1.5px 8px; background-image: linear-gradient(to right, #6e2cff 100%, transparent 0%)"
${sorted[0].votesComma} (${sorted[0].votesPercent}%)}}} ||\n`
  for (item of sorted.slice(1)) {
    text += `|| ${item.cand} ||<nopad> {{{#!wiki style="margin: 10px 0px; padding: 1.5px 8px; background-image: linear-gradient(to right, #6e2cff ${item.barPercent}%, transparent 0%)"
${item.votesComma} (${item.votesPercent}%)}}} ||\n`
  }
  text += `||<rowbgcolor=#000><rowcolor=#fff> '''총합''' || ${comma( sum )} ||
}}}}}}}}} ||}}}`

  console.log(text)
  navigator.clipboard.writeText(text)
  $('#that').empty()
  $('#that').append(`<span>Text is Copied.</span>`)
  $('#that').append(`<pre></pre>`)
  $('pre').text(text)
}

async function namuRun() {
  input('pollid') ? pollid = input('pollid') : breakOn = true;
  if (breakOn) {
      alert('Poll ID를 입력해주세요')
      breakOn = false
      return
  } else {
    // address = addressObj[input('addressSelect')];
    // mylist = await new new Web3Eth(new Web3HttpProvider("https://polygon-rpc.com")).Contract(myinstance,address).methods;
    candList = await read(cand);
    gravityResult(await read(candVot))
  }
}