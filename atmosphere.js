function feed() {
  var SA = 0
  try {
    SA = (parseInt(input('start_after')) || 0)
  } catch {}
  
  fetch(`https://api.cosmo.fans/news/v1/feed?artist=tripleS&limit=1&start_after=${SA}`,{
    headers: {'Accept-Language':'ko'}
  }).then(async (res) => {
    const data = await res.json()
    const object = data.results[0]

    feed_text = object.body
    var image_list = object.imageUrls
    $('#that').empty()
    $('#that').append(`<p onclick="navigator.clipboard.writeText(feed_text)">${feed_text}</p>`)
    for (i=0;i<image_list.length;i++) {
      $('#that').append(`<img src="${image_list[i]}" style="width:100%">`)
    }
  })
}

function searchByDate() {
  var atLeastOne = false
  var yymmdd = input('yymmdd')
  var yy = yymmdd.slice(0,2)
  var mm = yymmdd.slice(2,4)
  var dd = yymmdd.slice(4)
  $('#that').empty()

  fetch(`https://api.cosmo.fans/news/v1/feed?artist=tripleS&limit=32767`,{
    headers: {'Accept-Language':'ko'}
  }).then(async (res) => {
    const data = await res.json()
    const array = data.results

    array.forEach(item=>{
      var d = new Date(item.createdAt)
      if (d.getFullYear() == '20'+yy && d.getMonth()+1 == mm && d.getDate() == dd) {
        atLeastOne = true
        var feed_text = item.body
        var image_list = item.imageUrls
        $('#that').append(`<p onclick="navigator.clipboard.writeText(feed_text)">${feed_text}</p>`)
        for (i=0;i<image_list.length;i++) {
          $('#that').append(`<img src="${image_list[i]}" style="width:100%">`)
        }
      }
    })
    
    if (!atLeastOne) {
      $('#that').append(`<p>해당 날짜의 사진이 없습니다.</p>`)
    }
  })
}
