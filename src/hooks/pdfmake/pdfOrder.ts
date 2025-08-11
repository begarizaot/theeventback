import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

import { useGeneral } from "../useGeneral";
import { useMoment } from "../useMoment";

const { imageURLBase64 } = useGeneral();

export const PdfOrder = (data, tickets) => {
  return new Promise(async (resolve, reject) => {
    let pdfDefinition = await Promise.all(
      tickets.map(async (ticket, index) => {
        const pdf = [
          {
            image:
              (await imageURLBase64(
                "https://storage.googleapis.com/eventjetimg/imagen/bg_black_1f5cff80b2.png"
              )) || "",
            height: 40,
            width: 250,
            alignment: "center",
          },
          {
            margin: [0, 20, 0, 20],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "Event Ticket",
                    border: [false, false, false, false],
                    fillColor: "#000000",
                    fontSize: 20,
                    bold: true,
                    color: "#ffffff",
                    alignment: "center",
                  },
                ],
              ],
            },
            layout: {
              paddingTop: function (i, node) {
                return 10;
              },
              paddingBottom: function (i, node) {
                return 10;
              },
            },
          },
          {
            alignment: "justify",
            columns: [
              {
                marginTop: 50,
                marginRight: 20,
                stack: [
                  { text: data?.name || "", bold: true, fontSize: 16 },
                  {
                    text: `(${ticket?.event_ticket_id?.title || ""})`,
                    color: "#cf0032",
                  },
                  {
                    text: data?.event_locations_id?.title || "",
                    marginBottom: 10,
                  },
                  {
                    text: `${useMoment(data?.start_date).format("dddd, Do MMMM")}`,
                  },
                  {
                    text: `${useMoment(data?.start_date).format(
                      "hh:mm a"
                    )} - ${useMoment(data?.end_date).format("hh:mm a")}`,
                  },
                  {
                    text: `Age Restriction: ${
                      data?.event_restriction_id?.title || ""
                    }`,
                  },
                  ticket?.table
                    ? {
                        text: `Table: ${ticket?.table || ""}`,
                      }
                    : {},
                ],
              },
              {
                image: (await imageURLBase64(data?.url_image || "")) || "",
                height: 200,
                width: 180,
                alignment: "center",
                margin: [0, 20, 0, 0],
              },
            ],
          },
          {
            alignment: "center",
            columns: [
              {
                marginTop: 50,
                marginRight: 20,
                stack: [
                  {
                    text: `${data?.users_id?.firstName || ""} ${data?.users_id?.lastName || ""}`,
                  },
                ],
              },
            ],
          },
          {
            qr: ticket?.id_ticket || "",
            fit: 200,
            alignment: "center",
            marginTop: 20,
          },
        ];

        return [
          ...pdf,
          index !== tickets.length - 1
            ? {
                text: "",
                pageBreak: "after",
              }
            : {},
        ];
      })
    );

    pdfMake
      .createPdf({
        content: pdfDefinition,
        styles: {},
        defaultStyle: {
          font: "Roboto", // ✅ funciona con vfs_fonts
        },
      })
      .getBase64((encodedString) => {
        resolve(encodedString);
      });
  });
};
