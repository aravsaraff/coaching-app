const { course } = require('../models');
const { subject } = require('../models');

module.exports = () => {
    let exp = {};

    exp.addcourse = async (req, res) => {
        try {
            const courseobj = await course.create(req.body);
            return res.status(200).send(courseobj);

        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    }

    exp.addsubject = async (req, res) => {
        try {
            const subjectobj = await subject.create(req.body);
            return res.status(200).send(subjectobj);
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    }

    return exp;
}