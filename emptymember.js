exist = () => {
    var str = input('existMember')
    var arr = str.split(/[^0-9]+/g)
    var total = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
    var name = ["윤서연","정혜린","이지우","김채연","김유연","김수민","김나경","공유빈","카에데","서다현","코토네","곽연지","니엔","박소현","신위","마유","린","주빈","정하연","박시온","김채원","설린","서아","지연"]
    var text = total.filter(i=>!arr.includes(String(i))).map(i=>name[i-1]).join(', ')
    // console.log(text)

    $('#that').empty()
    // $('#that').append(`<pre></pre>`)
    $('#that').text(text)
}