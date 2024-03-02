async function sale(member) {
  const res = await fetch(
    `https://squid.subsquid.io/cosmo/graphql`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          query: `query {
            transfersConnection(orderBy: timestamp_DESC, where: {from_contains: "0x000000", AND: {objekt: {collection: {member_eq: "${member}", season_eq: "Cream01", class_eq: "First", number_gte: "109Z", number_lte: "116Z"}}}}, first: 100) {
              edges {
                node {
                  timestamp
                  objekt {
                    serial
                    collection {
                      number
                    }
                  }
                }
              }
            }
          }`
      })
    }
  )
  const json = await res.json()
  data = json.data.transfersConnection

  /*for (i=0;i<100;i++) {
  var seeing=data.edges[i].node
  var time = new Date(parseInt(seeing.timestamp))
  var col = seeing.objekt.collection.number
  var ser = seeing.objekt.serial
  console.log([col,ser,time].join(" "))
  }*/
  $('#that').empty();
  for (i=0;i<100;i++) {
    var seeing=data.edges[i].node
    var time = new Date(parseInt(seeing.timestamp))
    var col = seeing.objekt.collection.number
    var ser = seeing.objekt.serial
    $('#that').append("<p>"+[col,ser,time].join(" ")+"</p>")
  }
}

function heosoo(count){
  data.edges.splice(0,count)
}
//  l={}
// l={'101Z':'0','102Z':'0','103Z':'0','104Z':'0','105Z':'0','106Z':'0','107Z':'0','108Z':'0'}
function saleresult(){
  l={}
  for (i=0;i<data.edges.length;i++) {
    var seeing=data.edges[i].node
    var col = seeing.objekt.collection.number
    var ser = seeing.objekt.serial
    if ((l[col] || 0)<ser) {l[col]=ser}
    // console.log(l)
  }
  $('#that').empty()
  // $('#that').append([l['101Z'],l['102Z'],l['103Z'],l['104Z'],l['105Z'],l['106Z'],l['107Z'],l['108Z']].join())
  $('#that').append(Object.values(l).join())
}
