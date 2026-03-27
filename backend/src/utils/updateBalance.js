const { Store } = require("../model/store.schema");

module.exports = async function updateBalance({
    storeId,
    paymentType,
    amount,
    session
}) {
    if (!["cash", "bank"].includes(paymentType)) return;

    await Store.updateOne(
        { _id: storeId },
        {
            $inc: {
                [`balance.${paymentType}`]: amount
            }
        },
        { session }
    );
};
