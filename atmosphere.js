function feed() {
  var SA = 0
  try {
    SA = (parseInt(input('start_after')) || 0)
  } catch {}
  
  fetch(`https://api.cosmo.fans/news/v1/feed?artist=tripleS&limit=1&start_after=${SA}`).then(async (res) => {
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
