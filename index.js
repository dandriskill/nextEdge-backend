const rp = require('request-promise-native')
const _ = require('underscore')

const baseUrl = 'https://stackoverflow.com/jobs'

function downloadPages(pageCount) {
    let pagePromises =
        _.map(_.range(1, pageCount)
              , (count) => {
                  let url = baseUrl + '?pg=' + count + '&s=0'
                  return rp(url)
              })
    
    return Promise.all(pagePromises)
        .then((htmlPages) => {
            return new Promise((resolve, reject) => {
                let timeoutID = setTimeout(() => {
                    clearTimeout(timeoutID)
                    resolve(htmlPages.flat())
                }, 1000)
            })
        }).catch((err) => {
            console.log("error: ")
            console.log(err)
        })
}

const fs = require('fs')

downloadPages(5)
    .then((pages) => {
        fs.writeFileSync('./data/jobs-concat.html', pages)
    })
