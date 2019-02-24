var graphlib = require("graphlib")
var Graph = graphlib.Graph
const _ = require('underscore')
const fs = require('fs')

const jobs = require('./parse-jobs-html.js').jobs

function build() {
    var g = new Graph()
    g.setDefaultNodeLabel(0)
    g.setDefaultEdgeLabel(0)
    
    _.chain(jobs)
        .sortBy((job) => job.salary)
        .map((job) => job['skills'])
        .each((skills) => {
            _.each(skills, (a) => {
                _.each(skills, (b) => {
                    if (a !== b) {
                        // increase connectivity of skills
                        if (!g.hasEdge(a, b)) {
                            g.setEdge(a, b)
                        }
                        let edge = g.edge(a, b)
                        g.setEdge(a, b, edge + 1)

                        // increase the relevancy of each skill
                        let aLabel = g.node(a)
                        let bLabel = g.node(b)
                        g.setNode(a, aLabel + 1)
                        g.setNode(b, bLabel + 1)
                    }
                })
            })
        })

    let graphJson = graphlib.json.write(g)
    fs.writeFileSync('./data/skills.json', graphJson)
}

build()

exports.build = build
