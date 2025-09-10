import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_PK || "");

export const useStripe = () => {
  // paymentMethods
  const createPaymentMethod = async (token) => {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token },
    });

    return paymentMethod;
  };

  // paymentIntents
  const createPaymentIntents = async (ev) => {
    let customer = null;
    customer = await listFilterCustomers(ev.data.email);
    if (!customer) {
      customer = await createCustomer({
        email: ev.data.email,
        name: ev.data.name,
      });
    }

    const resPaymentIntent = await stripe.paymentIntents.create({
      amount: Number((parseFloat(ev.amount) * 100).toFixed(0)),
      currency: process.env.STRIPE_CURRENCY,
      payment_method_types: ["card","affirm"],
      payment_method: ev.payment,
      metadata: { ...ev.data },
      customer: customer,
    });

    return await configPaymentIntents(resPaymentIntent.id);
  };

  const updatePaymentIntents = async (id, data) => {
    const resPaymentIntent = await stripe.paymentIntents.update(id, data);
    return resPaymentIntent;
  };

  const configPaymentIntents = async (id) => {
    const resPaymentIntent = await stripe.paymentIntents.retrieve(id);
    if (
      !resPaymentIntent.status.includes("succe") &&
      resPaymentIntent.status !== "requires_confirmation"
    ) {
      const confirmedPaymentIntent = await stripe.paymentIntents.confirm(id);
      return confirmedPaymentIntent;
    } else {
      return resPaymentIntent;
    }
  };

  const retrievePaymentIntents = async (id) => {
    const resPaymentIntent = await stripe.paymentIntents.retrieve(id);
    return resPaymentIntent;
  };

  // customers
  const listFilterCustomers = async (email) => {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });
    return customers?.data[0]?.id || null;
  };

  const createCustomer = async (data) => {
    const customer = await stripe.customers.create(data);
    return customer.id;
  };

  // Refund
  const createRefund = async ({ paymentIntentId, amount }) => {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount
        ? Number((parseFloat(amount) * 100).toFixed(0))
        : undefined,
      reason: "requested_by_customer", // puede ser 'duplicate', 'fraudulent', o 'requested_by_customer'
    });

    return refund;
  };

  return {
    createPaymentMethod,
    createPaymentIntents,
    createRefund,
    updatePaymentIntents,
    retrievePaymentIntents,
  };
};
