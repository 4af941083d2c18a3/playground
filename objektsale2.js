function sale2(index,member,collection) {
  const id = ['cream01',member,collection].join('-')
  fetch(
    `https://nova.squids.live/cosmo/graphql`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: `query {
          objektsConnection(orderBy: id_ASC, where: {collection: {id_eq: "${id}"}}) {
            totalCount
          }
        }`
      })
    }).then(async (res) => {
      const json = await res.json()
      const data = json.data.objektsConnection

      const count = data.totalCount
      var num = String(parseInt(index)+1).padStart(2,'0')
      l[`S${num}-${collection}`]=count
    }
  )
}

function sale2run() {
  mems = ['seoyeon','hyerin','jiwoo','chaeyeon','yooyeon','soomin','nakyoung','yubin','kaede','dahyun','kotone','yeonji','nien','sohyun','xinyu','mayu','lynn','joobin','hayeon','shion']
  objektSaleList={}
  
  for (index in mems) {
    console.log(sale2(index,mems[index],'311z'))
    console.log(sale2(index,mems[index],'312z'))
    console.log(sale2(index,mems[index],'313z'))
  }
  
  console.log(objektSaleList)
}

function sale2csv() {
  csv = ''
  for (num=1; num<21; num++) {
    num = String(num).padStart(2,'0')
    csv += l[`S${num}-311z`]+','
    csv += l[`S${num}-312z`]+','
    csv += l[`S${num}-313z`]+'\n'
  }
}