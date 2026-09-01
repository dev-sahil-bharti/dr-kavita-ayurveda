const Setting = require('../models/Setting');

exports.getSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  return settings;
};

exports.updateSettings = async (data) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(data);
  } else {
    settings = await Setting.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
    });
  }
  return settings;
};
