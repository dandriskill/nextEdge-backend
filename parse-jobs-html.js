const $ = require('cheerio')
const fs = require('fs')
const _ = require('underscore')
const util = require('util')

let jobsHtml = fs.readFileSync('./data/jobs-concat.html', { encoding: 'utf8' })

let jobSummaries = $('.-job-summary', jobsHtml)


function toArray(cheerioResult) {
    return _.map(_.range(0, (cheerioResult.length + 1))
          , (key) => {
              return cheerioResult[key]
          })
}

function between(str, start, end) {
    let s = str.indexOf(start)
    let e = str.indexOf(end)
    return str.slice(s + 1, e)
}

let jobs =
    _.map(toArray(jobSummaries)
          , (summary) => {
              let job = {}
              job.tile = $('.s-link', summary).text()
              
              let company = $('.-company', summary).text().slice(1).trimStart()
              let end = company.indexOf('\n')
              job.company = company.slice(0, end)
              
              let salary = $('.-salary', summary).text()
              job.salary = parseInt(between(salary, '$', 'k'))
              
              job.skills = _.map(toArray($('.post-tag', summary))
                                 , (skillNode) => {
                                     return $(skillNode).text()
                                 }).filter((skill) => skill !== '' )

              return job
          }).filter((job) => job['title'] !== "")

fs.writeFileSync('./data/jobs.json', JSON.stringify(jobs, null, 2), 'utf-8')

