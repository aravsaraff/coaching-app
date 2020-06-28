module.exports = (sequelize, DataTypes) => {
    let Subject = sequelize.define(
        'subject',
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
                    msg: 'Subject already exists.'
                }
            },
            desc: {
                type: DataTypes.STRING,
                allowNull: false
            },
            teacher: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        },
        {
            underscored: true,
            tableName: 'subjects'
        }
    );

    Subject.associate = (models) =>{
        models.subject.belongsTo(models.course,{
            as: 'course',
            foreignKey: {
                name: 'course_id',
                allowNull: false
            }
        });
        models.subject.hasMany(models.topic,{
            as: 'topics',
            foreignKey: {
                name: 'subject_id',
                allowNull: false
            }
        });
    };

    return Subject;
};