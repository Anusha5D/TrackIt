const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const STATUS_VALUES = [
  'Applied',
  'OA',
  'Phone Screen',
  'Technical',
  'Onsite',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const JOB_TYPE_VALUES = ['Full-time', 'Internship', 'Contract', 'Part-time'];

class Application extends Model {
  // Reshape output to match what the client already expects from Mongo (_id)
  toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    delete values.id;
    return values;
  }
}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Equivalent of the Mongo ObjectId ref to User — real FK now, with an index
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: 'id' },
      onDelete: 'CASCADE',
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Company is required' } },
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Role is required' } },
    },
    status: {
      type: DataTypes.ENUM(...STATUS_VALUES),
      defaultValue: 'Applied',
    },
    dateApplied: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    salaryMin: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: 0 },
    },
    salaryMax: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: 0 },
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    jobType: {
      type: DataTypes.ENUM(...JOB_TYPE_VALUES),
      defaultValue: 'Full-time',
    },
    jobLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPerson: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { len: { args: [0, 2000], msg: 'Notes too long' } },
    },
    nextStep: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    nextStepDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    timestamps: true,
    hooks: {
      beforeSave: (application) => {
        if (application.contactEmail) {
          application.contactEmail = application.contactEmail.trim().toLowerCase();
        }
      },
    },
    indexes: [
      // Compound index for the most common query: "all my apps, newest first"
      { fields: ['userId', 'dateApplied'] },
    ],
  }
);

User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

// Export constants alongside the model so routes can use them for validation
Application.STATUS_VALUES = STATUS_VALUES;
Application.JOB_TYPE_VALUES = JOB_TYPE_VALUES;

module.exports = Application;
