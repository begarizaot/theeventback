export const onGroupTickets = (data) => {
  const agrupado = data.reduce((acc, item) => {
    const id = item.event_ticket_id.id;
    if (!acc[id]) {
      acc[id] = {
        ticketId: id,
        title: item.event_ticket_id.title,
        select: 0,
        price: item.value,
      };
    }
    acc[id].select += 1;
    return acc;
  }, {});
  return Object.values(agrupado).map((item: any) => ({
    ticketId: item.ticketId,
    title: item.title,
    select: item.select,
    price: (item.price || 0).toFixed(2),
  }));
};

export const OrderFindOne = async (filters = {}, populate?) => {
  return (
    await strapi.entityService.findMany("api::order.order", {
      populate: populate || "*",
      filters: {
        ...filters,
      },
    })
  )[0];
};

export const OrderFindMany = async (filters = {}, populate?) => {
  return await strapi.entityService.findMany("api::order.order", {
    populate: populate || "*",
    filters: {
      ...filters,
    },
  });
};

export const OrderFindPage = async (
  filters = {},
  populate?,
  sizePage = {
    page: 1,
    pageSize: 10,
  },
  sort = {}
) => {
  return await strapi.entityService.findPage("api::order.order", {
    populate: populate || "*",
    filters: {
      ...filters,
    },
    ...sizePage,
    sort,
  });
};

export const OrderCreate = async (data = {}, populate?, fields = null) => {
  return await strapi.entityService.create("api::order.order", {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};

export const OrderUpdate = async (
  idOrder = null,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update("api::order.order", idOrder, {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};

export const OrderAnalityEvent = async (eventId: any, showTable?: boolean) => {
  const orders = await strapi.entityService.findMany("api::order.order", {
    filters: {
      event_id: {
        id: eventId,
      },
    },
    populate: {
      tickets_id: {
        populate: ["event_ticket_id"],
      },
      event_affiliate_id: {
        fields: ["state", "value"],
      },
    },
    fields: [
      "base_price",
      "discount_price",
      "isRefundable",
      "freeOrder",
      "order_id",
    ],
  });

  const createGroupStructure = () => ({
    totalValue: 0,
    totalQuantity: 0,
    ticketMap: {},
  });

  const groups = {
    eventSales: createGroupStructure(),
    tableSales: createGroupStructure(),
    ticketSales: createGroupStructure(),
    ticketComp: createGroupStructure(),
    refundable: createGroupStructure(),
    affiliate: createGroupStructure(),
    scanner: createGroupStructure(),
  };

  let totalBasePrice = 0;
  let totalTickets = 0;
  let totalScanned = 0;
  let totalRefundable = 0;

  let totalDiscountValue = 0;
  let totalDiscountQuantity = 0;

  const addToGroup = (group, ticket) => {
    const ticketId = ticket.event_ticket_id?.id;

    if (!ticketId) return;

    if (!group.ticketMap[ticketId]) {
      group.ticketMap[ticketId] = {
        ticketId,
        title: ticket.event_ticket_id.title,
        quantity: 0,
        totalValue: 0,
        price: ticket.event_ticket_id.price || 0,
      };
    }

    group.ticketMap[ticketId].quantity += 1;
    group.ticketMap[ticketId].totalValue += ticket.value || 0;
    group.totalQuantity += 1;
    group.totalValue += ticket.value || 0;
  };

  orders.forEach((order: any) => {
    if (!order.isRefundable) {
      const discount = order.discount_price || 0;
      if (discount > 0) {
        totalDiscountValue += discount;
        totalDiscountQuantity += 1;
      }

      const base = order.base_price || 0;
      const netBase = base - discount;

      !order.freeOrder &&
        (totalBasePrice += order.base_price - Number(discount || 0) || 0);

      // ✅ Calcular comisión o valor de afiliado
      if (order.event_affiliate_id && !order.freeOrder) {
        const { state, value } = order.event_affiliate_id;
        let affiliateAmount = 0;

        if (state === "por") {
          affiliateAmount = (netBase * value) / 100;
        } else if (state === "val") {
          affiliateAmount = value;
        }

        groups.affiliate.totalValue += affiliateAmount;
        groups.affiliate.totalQuantity += 1;
      }

      order.tickets_id?.forEach((ticket: any) => {
        const hasTable = ticket?.table;
        const isScanned = ticket.isScanner === true;

        totalTickets += 1;
        if (isScanned) {
          totalScanned += 1;
          addToGroup(groups.scanner, ticket);
        }

        addToGroup(groups.eventSales, ticket);

        if (order.freeOrder) {
          addToGroup(groups.ticketComp, ticket);
        } else if (hasTable) {
          addToGroup(groups.tableSales, ticket);
        } else {
          addToGroup(groups.ticketSales, ticket);
        }
      });
    } else {
      totalRefundable += 1;
      order.tickets_id?.forEach((ticket: any) => {
        addToGroup(groups.refundable, ticket);
      });
    }
  });

  const formatGroup = (group) => ({
    totalQuantity: group.totalQuantity,
    totalValue: group.totalValue.toFixed(2),
    ticketsGrouped: Object.values(group.ticketMap).map((item: any) => ({
      ticketId: item.ticketId,
      title: item.title,
      quantity: item.quantity,
      totalValue: item.totalValue.toFixed(2),
      price: item.price,
    })),
  });

  const scanStats = {
    totalTickets,
    totalScanned,
    percentageScanned:
      totalTickets > 0 ? ((totalScanned / totalTickets) * 100).toFixed(0) : "0",
  };

  const eventSalesFormatted = {
    totalBasePrice: totalBasePrice.toFixed(2),
    ...formatGroup(groups.eventSales),
    ticketData: [
      {
        type: "Ticket Sales",
        ...formatGroup(groups.ticketSales),
      },
      ...(showTable
        ? [
            {
              type: "Table Sales",
              ...formatGroup(groups.tableSales),
            },
          ]
        : []),
      {
        type: "Ticket Comp",
        ...formatGroup(groups.ticketComp),
      },
      {
        type: "Discounts",
        totalQuantity: totalDiscountQuantity,
        totalValue: totalDiscountValue.toFixed(2),
      },
      {
        type: "Affiliate",
        totalQuantity: groups.affiliate.totalQuantity,
        totalValue: groups.affiliate.totalValue.toFixed(2),
        icon: "pi-percentage",
      },
      {
        type: "Refundable",
        ...formatGroup(groups.refundable),
        icon: "pi-chart-bar",
      },
    ],
  };

  return {
    eventSales: eventSalesFormatted,
    scanStats: {
      ...scanStats,
      ticketSales: formatGroup(groups.scanner).ticketsGrouped ?? [],
    },
  };
};
