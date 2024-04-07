async function totalComo(address) {
    $('#that').empty()
    $('#that').append('<span>값을 불러오고 있습니다아아아...</span>')
    if (!address) {$('#that > span').text('값을 불러올 수 없습니다.');alert('지갑주소나 아이디를 입력해주세요.');return}
    var add = await addressCheck(address)
    if (!add) {$('#that > span').text('값을 불러올 수 없습니다.');alert('해당 유저가 존재하지 않습니다.');return}
    var data = await fetch(
        `https://squid.subsquid.io/cosmo/graphql`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    query: `{
                        comos(where: {owner_eq: "${add}"}) {
                            balance
                            contract
                        }
                        votesConnection(where: {from_eq: "${add}"}, first: 99, orderBy: timestamp_DESC) {
                            edges {
                                node {
                                   amount
                                   contract
                                }
                            }
                        }
                    }`
                }
            )
        }
    )
    var json = await data.json()
    // console.log(json)
    var como = {'tripleS':0,'ARTMS':0}
    json.data.comos.forEach(item => {
        var bal = parseInt(parseInt(item.balance)/(10**18))
        if (item.contract == "0x58aeabfe2d9780c1bfcb713bf5598261b15db6e5") {
            como.tripleS += bal
        } else {
            como.ARTMS += bal
        }
    })
    json.data.votesConnection.edges.forEach(item => {
        var bal = parseInt(parseInt(item.node.amount)/(10**18))
        if (item.node.contract == "0xc3e5ad11ae2f00c740e74b81f134426a3331d950") {
            como.tripleS += bal
        } else {
            como.ARTMS += bal
        }
    })
    $('#that').empty()
    $('#that').append(`<p>tripleS : 누적 ${comma(como.tripleS)} COMO</p><p>ARTMS : 누적 ${comma(como.ARTMS)} COMO</p>`)
}

async function addressCheck(text) {
    try {
        return text.slice(0,2) == '0x' ? text : await cosmoIdSearch(text)
    } catch {return false}
}

async function cosmoIdSearch(id) {
    var data = await fetch('https://api.cosmo.fans/user/v1/by-nickname/'+id)
    var json = await data.json()
    return json.profile.address
}
