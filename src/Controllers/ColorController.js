const color = require("../Models/color");

exports.addColor = (req, res) => {
  const { prName, code, enName } = req.body;
  let colorObj = {
    prName,
    code,
    enName,
  };
  let newColor = new color(colorObj);
  newColor.save((err, _color) => {
    if (err) return res.status(400).json({ success: false, err });
    if (_color) {
      return res.json({
        success: true,
        _color,
      });
    }
  });
};

exports.getColor = (req, res) => {
  color.find({}).exec((err, colors) => {
    if (err) return err;
    if (color) {
      return res.json({
        success: true,
        colors,
      });
    }
  });
};
