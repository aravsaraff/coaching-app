module.exports = (sequelize, DataTypes) => {
    let Course = sequelize.define(
        'course',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true               
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Course with the given name already exists.'
                }
            },
            price: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false
            },
            desc: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            underscored: true,
            tableName: 'courses'
        }
    );

    Course.associate = (models)=>{
        models.course.belongsTo(models.institute, {
            as: 'institute',
            foreingKey: {
                name: 'institute_id',
                allowNull: false
            }
        });
        models.course.hasMany(models.subject,{
            as: 'subjects',
            foreingKey: {
                name: 'course_id',
                allowNull: false
            }
        });
        models.course.belongsToMany(models.user,{
            through: 'courses_paid',
            foreingKey: 'course_id'
        });
    };
    return Course;
};