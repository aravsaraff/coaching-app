const { course, Sequelize } = require('../models');
const { user } =require('../models');

module.exports = () => {
    let exp = {};
    const Op = Sequelize.Op;

    exp.viewcourses = async (req, res) => {
        try{
            if (!req.query.search) req.query.search = '%';
            else req.query.search = '%' + req.query.search + '%';
            const courses = await course.findAll({
                where : {
                    name: {
                        [Op.like] : req.query.search
                    }
                }
            });
            return res.status(200).send(courses);
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    }

    exp.viewpaidcourses = async (req, res) => {
        try{
            const paidcourses = await user.findByPk(req.user.id,{
                attributes: [ ],
                include: [
                    {
                        model: course
                    }
                ]
            });
            return res.status(200).send(paidcourses.courses);
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    }

    return exp;
}