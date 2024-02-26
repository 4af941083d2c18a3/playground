async function progressRun(standard, unit, accumulate) {
    await variableSetting()
    var data = await fetch(
        `https://squid.subsquid.io/cosmo/graphql`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    query: `{
                        votesConnection(orderBy: timestamp_ASC, first: ${totalVotes}, where: {poll_eq: "${pollid}"}) {
                            edges {
                                node {
                                    amount
                                    candidate
                                    timestamp
                                }
                                cursor
                            }
                        }
                    }`
                }
            )
        }
    )
    var json = await data.json()
    var array = json.data.votesConnection.edges
    if (standard == 'count') {
        progressByCount(unit, array, accumulate)
    } else if (standard == 'time') {
        progressByTime(unit, array, accumulate)
    }
}

async function progressByCount(unit, array, accumulate) {
    var csv = ''
    csv += ',' + await candList.join() + '\n'
    csv += new Array(await candNum+1).fill(0).join()

    const votes = new Array(await candNum).fill(0)
    for (j=0; j<Math.ceil(await array.length/unit); j++) {
        for (i=0; i<Math.min(unit,array.length-unit*j); i++) {
            const seeing = array[unit*j + i].node
            votes[seeing.candidate] += parseInt(parseInt(seeing.amount)/(10**18))
        }
        csv += `\n${Math.min(unit*j+unit,array.length)},${votes.join()}`

        if (!accumulate) {
            votes.fill(0)
        }
    }

    navigator.clipboard.writeText(csv)
    alert('Text is copied.')
}

async function progressByTime(unit, array, accumulate) {
    var csv = ''
    csv += ',' + await candList.join() + '\n'
    csv += new Array(await candNum+1).fill(0).join()

    var pollInfo = await read(polls)
    var section = parseInt(pollInfo.startAt) * 1000
    var endUnix = parseInt(pollInfo.due) * 1000
    var sectionList = []
    while (section < endUnix) {
        section += unit * 60000
        sectionList.push(section)
    }
    
    const votes = new Array(await candNum).fill(0)
    for (item of array) {
        const seeing = item.node
        if (parseInt(seeing.timestamp) > sectionList[0]) {
            csv += `\n${sectionList[0]/60000 - parseInt(pollInfo.startAt)/60},${votes.join()}`
            if (!accumulate) {
                votes.fill(0)
            }
            sectionList.shift()
        }
        votes[seeing.candidate] += parseInt(parseInt(seeing.amount)/(10**18))
    }
    csv += `\n${(parseInt(pollInfo.due) - parseInt(pollInfo.startAt))/60},${votes.join()}`

    navigator.clipboard.writeText(csv)
    alert('Text is copied.')
}

function progressSelect() {
    var val = $('#selectStandard').val()
    if (val == 'count') {
        $('#progressUnit').val('100')
        return '100'
    } else if (val == 'time') {
        $('#progressUnit').val('60')
        return '60'
    }
}

function progressFront() {
    var standard = input('selectStandard')
    var unit = parseInt(input('progressUnit') || progressSelect())
    var accumulate = input('selectAccumulate')

    progressRun(standard,unit,accumulate)
}
