const Cart = require("../Models/cart");

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}
exports.addToCart = (req, res) => {
  let { cartItems } = req.body;

  const { user } = req.user;
  console.log(cartItems);
  Cart.findOne({ user: user._id }).exec((err, cart) => {
    let promiseArray = [];
    if (err) return res.status(400).json(err);
    if (cart) {
      cartItems.map((item) => {
        let product = item.product;
        let UpdatedProduct = cart.cartItems.find(
          (_item) => _item.product == item.product && _item.size == item.size
        );
        let condition, updated;
        if (UpdatedProduct) {
          condition = {
            user: user._id,
            "cartItems.product": product,
            "cartItems.size": item.size,
          };
          updated = {
            $set: {
              "cartItems.$": item,
            },
          };
        } else {
          condition = { user: user._id };
          updated = {
            $push: {
              cartItems: item,
            },
          };
        }
        promiseArray.push(runUpdate(condition, updated));
      });
      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      let newCart = new Cart({
        user: user._id,
        cartItems,
      });
      newCart.save((err, _cart) => {
        if (err) return res.status(400).json(err);
        if (_cart) {
          return res.json({ success: true, _cart });
        }
      });
    }
  });
};

exports.getCartItmes = (req, res) => {
  let { user } = req.user;

  Cart.findOne({ user: user._id })
    .populate({
      path: "cartItems.product",
      populate: {
        path: "productImg.img",
      },
    })
    .exec((err, cart) => {
      if (err) return res.status(400).json(err);
      if (cart) {
        console.log(cart);
        let cartItems = {};
        cart.cartItems.map((item) => {
          let cartItemsID = item.product._id.toString() + "&" + item.size;
          cartItems[cartItemsID] = {
            _id: item.product._id.toString(),
            name: item.product.name,
            img: item.product.productImg[0].img,
            price: item.product.price,
            qty: item.quantity,
            size: item.size,
          };
        });
        return res.json(cartItems);
      }
    });
};

exports.removeItem = () => {};
