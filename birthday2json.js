function birth2json() {
    var object = {
        "twitter": {
            "status": [
                true
            ],
            "tweets": [
                tweets(input('birth-tweets1'))
            ],
            "tags": [
                tag(input('birth-tag1'))
            ],
            "imageLinks": [
                image(input('birth-image1'))
            ]
        },
        "startDate": parseInt(input('birth-start') || 0),
        "endDate": parseInt(input('birth-end') || 0)
    }

    if (input('birth-tweets2')) {
        object.twitter.tweets.push(tweets(input('birth-tweets2')))
        object.twitter.status.push(true)
    }
    if (input('birth-tag2')) {
        object.twitter.tags.push(tag(input('birth-tag2')))
    }
    if (input('birth-image2')) {
        object.twitter.imageLinks.push(image(input('birth-image2')))
    }

    if (input('birth-name')) {
        object.locate = {
            "name": input('birth-name'),
            "address": input('birth-address'),
            "kakaoMap": kakao(input('birth-kakao')),
            "googleMap": google(input('birth-google')),
            "naverMap": input('birth-naver').split('naver.me/')[1]
        }
    }
    
    console.log(object)
    $('#that').empty()
    $('#that').append(`<pre></pre>`)
    $('pre').text(JSON.stringify(object,null,4))
}

function tweets(data) {
    return data && data.split('.com/')[1].split('?')[0]
}

function image(data) {
    return data && data.split('media/')[1].split('?')[0]
    // https://pbs.twimg.com/media/GIDDfnJbwAAj18f?format=jpg&name=large
}

function google(data) {
    return data && data.split('embed?pb=')[1].split('" width')[0]
    // <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.219415701337!2d127.05232127570955!3d37.50274282778391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca410c04181a3%3A0xaa2c15db7357dab4!2z66CI7J207Ja07Iqk7Yqc65SU7Jik!5e0!3m2!1sko!2skr!4v1710645529107!5m2!1sko!2skr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
}

function kakao(data) {
    if (!data) {return ''}
    var obj = JSON.parse(data.split('daum.roughmap.Lander(')[1].split(').render();')[0])
    return {"timestamp":obj.timestamp,"key":obj.key}
}

function tag(data) {
    var array = data.split('#')
    return data && array[array.length-1]
}

function birthReset() {
    document.querySelectorAll("body > div.grid > div:nth-child(7) > input").forEach((r)=>{
        r.value=''
    })
}