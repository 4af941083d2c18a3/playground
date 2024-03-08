function sch2json() {
    var title = input('sch-title')
    var detail = input('sch-detail')
    var time = input('sch-time')
    var member = input('sch-member')

    var text = 
`                {
                    "title" : ${title},
                    "detail" : ${detail},
                    "time" : ${time},
                    "member" : ${member}
                }`
    // var blank = '            '

    navigator.clipboard.writeText(text)
    $('#that').empty()
    $('#that').append(`<span>Text is Copied.</span>`)
}