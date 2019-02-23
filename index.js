const rp = require('request-promise')
const $ = require('cheerio')
const _ = require('underscore')

const url = 'https://stackoverflow.com/jobs'

// rp(url)
//     .then(function(html){
//         //success!
//         
//     })
//     .catch(function(err){
//         //handle error
//     });


function downloadPages(pageCount) {
    let pagePromises =
        _.map(_.range(pageCount)
              , (count) => {
                  return rp(url + '&pg=' + count)
              })
    Promise.all(pagePromises)
        .then((html) => {
            console.log(html.length())
            // console.log($('.post-tag', html).text())
        })
}

downloadPages(1)
