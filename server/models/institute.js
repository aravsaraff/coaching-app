module.exports = (sequelize, DataTypes) => {
    let Institute = sequelize.define(
        'institute',
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
                    msg: 'Institute already exists.'
                }
            },
            mem_id: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        },
        {
            underscored: true,
            tableName: 'institutes'
        }
    );

    Institute.associate = (models) =>{
        models.institute.hasMany(models.course,{
            as: 'courses',
            foreignKey: {
                name: 'institute_id',
                allowNull: false
            }
        });
    };

    return Institute;
};