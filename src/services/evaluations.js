const http = require('http')
const passport = require('passport')
const query = require('../query')
const logger = require('../logger')
const {
    isAuthorized,
    isAuthenticated,
    isPermitted,
    isLessThanTwoAuthorized,
    isLessThanThreeAuthorized,
    isLessThanFourAuthorized,
    isEqualAuthorized,
    roles
} = require('../hooks/policy')
const { handleError, handleSuccess } = require('../hooks/http')
const validation = require('../hooks/validation')

module.exports = (app, options) => {
    app.get('/evaluations/:evaluation_id', isAuthenticated(options), isLessThanFourAuthorized, (req, res) => {
        const { evaluation_id } = req.params

        return app.pg.query(query.evaluations.findOne, [evaluation_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows[0])
            }

            return handleSuccess(req, res, 'evaluation not found')
        })
    })

    app.get('/evaluations/evaluator/:evaluator_id', isAuthenticated(options), isLessThanFourAuthorized, (req, res) => {
        const { evaluator_id } = req.params

        return app.pg.query(query.evaluations.findByEvaluator, [evaluator_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows)
            }

            return handleSuccess(req, res, `evaluation for evaluator: ${evaluator_id} found`)
        })
    })

    app.get('/evaluations/projects/:project_id', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id } = req.params

        return app.pg.query(query.evaluations.findByProject, [project_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows)
            }

            return handleSuccess(req, res, `evaluation for project: ${project_id} not found`)
        })
    })

    app.post('/evaluations', validation.evaluations.create, isAuthenticated(options), isLessThanFourAuthorized, (req, res) => {
        const { project_id, evaluator_id, evaluation, originality = -1 } = req.body
        const records = []

        for (e of evaluation) {
            const { rubric_id = -1, name = "", score } = e

            if (rubric_id == -1) {
                return handleError(null, req, res, `rubrics_id: ${rubric_id} is invalid`)
            }

            records.push({
                project_id,
                evaluator_id,
                rubric_id,
                name,
                score,
                originality: -1,
                is_grade_summary: false
            })
        }

        if (originality >= 0) {
            records.push({
                project_id,
                evaluator_id,
                rubric_id: null,
                name: '(O) Originality (Absence of plagiarism)',
                score: -1,
                originality,
                is_grade_summary: true,
            })
        }

        let insert = (records, next, callback) => {
            if (next == records.length) {
                return callback(null)
            }

            const record = records[next]

            return app.pg.query(query.evaluations.create, [
                record.project_id,
                record.evaluator_id,
                record.rubric_id,
                record.name,
                record.score,
                record.is_grade_summary,
                record.originality
            ], (err) => {
                if (err) {
                    return callback(err)
                }

                return insert(records, next + 1, callback)
            })
        }

        insert(records, 0, (err) => {
            if (err) {
                return handleError(err, req, res)
            }

            return handleSuccess(req, res, 'evaluation stored')
        })
    })

    app.get('/evaluations', isAuthenticated(options), isLessThanFourAuthorized, (req, res) => {
        return app.pg.query(query.evaluations.find, [], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                return handleSuccess(req, res, null, b.rows)
            }

            return handleSuccess(req, res, 'no evaluations found')
        })
    })

    app.get('/evaluations/projects/:project_id/download', isAuthenticated(options), isEqualAuthorized, (req, res) => {
        const { project_id } = req.params

        return app.pg.query(query.evaluations.download, [project_id], (err, b) => {
            if (err) {
                return handleError(err, req, res)
            }

            if (b.rows && b.rows[0]) {
                let evaluation = {}

                for (const row of b.rows) {
                    if ((row.rubrics_section && !row.is_grade_summary) && !evaluation[row.rubrics_section]) {
                        evaluation[row.rubrics_section] = {
                            total: 0,
                            section_percentage: row.rubrics_section_percentage,
                            rows: []
                        }
                    }

                    if (!row.rubrics_section && row.is_grade_summary) {
                        evaluation['Grade Summary'] = row
                        continue
                    }

                    const scoreWeight = row.score * row.rubrics_criterion_weight

                    evaluation[row.rubrics_section].total += scoreWeight
                    evaluation[row.rubrics_section].rows.push({
                        ...row,
                        score_weight: scoreWeight
                    })
                }

                let gTotal = 0

                for (const e in evaluation) {
                    if (evaluation[e].total) {
                        gTotal += evaluation[e].total
                    }
                }

                const tTotal = gTotal / 4
                const tO = tTotal * (evaluation['Grade Summary']['originality'] / 100)

                evaluation['Grade Summary'] = {
                    ...evaluation['Grade Summary'],
                    g_total: gTotal,
                    t_total: Math.round(tTotal),
                    t_o: Math.round(tO)
                }

                return handleSuccess(req, res, null, evaluation)
            }

            return handleSuccess(req, res, `evaluation for project: ${project_id} not found`)
        })
    })
}
