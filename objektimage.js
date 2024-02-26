total = []

async function image(address) {
  var next = 0
  var res = await fetch('https://api.cosmo.fans/objekt/v1/owned-by/'+address+'?start_after='+next)
  var data = await res.json()
  
  for (i=0;i<list.length;i++){
    var seeing = list[i]
    var testee = [...seeing.collectionId.split(' '),seeing.frontImage]
    if (!(total.includes(testee))) {
      total.push(testee)
    }
  }
  
  if (data.hasNext=='true') {
    next += 30
  } else {return}
}
