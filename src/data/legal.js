// Policy copy for the pages Paddle reviews during seller approval.
//
// BUSINESS_NAME, CONTACT_EMAIL and JURISDICTION are the only things that need
// filling in — they appear throughout the documents below.
export const BUSINESS_NAME = "MCP Audio";
export const CONTACT_EMAIL = "support@mcpaudio.com";
export const JURISDICTION = "the State of California, United States";
export const LAST_UPDATED = "18 October 2026";

export const legalPages = {
  terms: {
    title: "Terms of Service",
    sections: [
      {
        heading: "Who we are",
        body: `${BUSINESS_NAME} sells downloadable audio sample packs and music software. These terms govern your purchase and use of those products. By buying from us you agree to them.`,
      },
      {
        heading: "What you are buying",
        body: `Each sample pack is a digital download delivered as a ZIP archive. Nothing physical ships. You are buying a licence to use the audio contained in the pack, not ownership of the recordings themselves.`,
      },
      {
        heading: "Your licence",
        body: `You may use the sounds in your own musical compositions, commercially or otherwise, including in tracks you release, sell, or license for sync. You may do this in perpetuity and worldwide, with no royalty owed to us and no credit required.

You may not resell, redistribute, or give away the sounds in their original form, or as part of another sample pack, loop library, preset collection, or sound bank. You may not upload them to sample-sharing sites. In short: make music with them freely; do not resell the raw material.`,
      },
      {
        heading: "Your download",
        body: `Your download link is personal to your purchase. It remains valid for 90 days and allows up to 10 downloads, which is intended to cover re-downloads across your own machines. Please do not share the link. If it expires or runs out and you still need the files, email us and we will reissue it.`,
      },
      {
        heading: "Payment",
        body: `Payments are processed by Paddle.com Market Ltd, which acts as the merchant of record for your purchase. Paddle handles billing, applicable sales tax and VAT, and will appear on your statement. Paddle's own buyer terms apply alongside these.`,
      },
      {
        heading: "Availability",
        body: `We may change prices, update pack contents, or stop selling a pack at any time. Changes do not affect purchases already made — what you bought stays yours under the licence above.`,
      },
      {
        heading: "Liability",
        body: `Our products are provided as they are. To the extent the law allows, our liability for any claim relating to a purchase is limited to the amount you paid for it. Nothing here limits liability that cannot legally be limited.`,
      },
      {
        heading: "Governing law",
        body: `These terms are governed by the laws of ${JURISDICTION}.`,
      },
      {
        heading: "Contact",
        body: `Questions about these terms: ${CONTACT_EMAIL}.`,
      },
    ],
  },

  refunds: {
    title: "Refund Policy",
    sections: [
      {
        heading: "The short version",
        body: `If a pack does not work, or is not what we described, email ${CONTACT_EMAIL} within 14 days and we will refund you in full. We would rather give your money back than have you stuck with something you cannot use.`,
      },
      {
        heading: "Why digital downloads are different",
        body: `Once a sample pack has been downloaded it cannot be returned in any meaningful sense — you still have the files. For that reason we cannot offer refunds simply because you changed your mind after downloading, in the same way a record shop will not take back an opened record.

That said, we would rather resolve a genuine problem than win an argument. The cases below are always refunded.`,
      },
      {
        heading: "We will always refund",
        body: `• The download is corrupt, incomplete, or will not open
• The pack's contents differ materially from the description on this site
• You were charged twice, or charged for something you did not buy
• You bought the wrong pack and have not yet downloaded it`,
      },
      {
        heading: "We generally cannot refund",
        body: `• You have downloaded the pack and simply decided you do not like the sounds
• The pack does not suit a project, genre, or workflow you had in mind
• Your computer or software cannot open a standard ZIP or WAV file — email us, we will help you rather than refund you`,
      },
      {
        heading: "How to request one",
        body: `Email ${CONTACT_EMAIL} with the email address you bought under and which pack is affected. Tell us what went wrong. We aim to reply within two business days.

Refunds are issued by Paddle, our merchant of record, back to the original payment method. Paddle typically returns funds within five to ten business days depending on your bank.`,
      },
      {
        heading: "Statutory rights",
        body: `Nothing in this policy removes rights you have by law in your own country. UK and EU buyers: digital downloads are supplied immediately with your consent at checkout, and the statutory 14-day right of withdrawal does not apply once the download has begun. Where that right does still apply, you keep it in full.`,
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "What we collect",
        body: `Very little. When you buy a pack we receive your email address and the fact of your purchase. We do not see, store, or have any access to your card details — those go directly to our payment processor.`,
      },
      {
        heading: "Who processes your payment",
        body: `Paddle.com Market Ltd acts as merchant of record and handles payment, billing, and tax. They collect what they need to do that, including your card details and billing country. Their privacy policy governs that data.`,
      },
      {
        heading: "What we do with your email",
        body: `We use it to deliver your download and to contact you about that purchase if something goes wrong. We do not sell it, rent it, or pass it to anyone else, and we will not add you to a mailing list off the back of a purchase.`,
      },
      {
        heading: "Download records",
        body: `When you buy, we store a download token alongside your pack and email so the link works. These records expire automatically after 90 days.`,
      },
      {
        heading: "Hosting",
        body: `This site and our files are hosted on Cloudflare. Standard server logs, including IP addresses, are produced as part of serving the site.`,
      },
      {
        heading: "Your rights",
        body: `You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email ${CONTACT_EMAIL} and we will action it. Deleting your purchase record will invalidate any active download link.`,
      },
    ],
  },

  contact: {
    title: "Contact",
    sections: [
      {
        heading: "Get in touch",
        body: `Email ${CONTACT_EMAIL}. One of us reads it — there is no support desk. We aim to reply within two business days.`,
      },
      {
        heading: "Download problems",
        body: `If a link has expired, run out of downloads, or will not open, email us with the address you bought under and we will sort it out. Please do not buy the pack a second time.`,
      },
      {
        heading: "Licensing questions",
        body: `If you are unsure whether a particular use is covered by the licence, ask. We would rather answer the question than have you guess.`,
      },
      {
        heading: "Business details",
        body: `${BUSINESS_NAME}
Payments processed by Paddle.com Market Ltd, acting as merchant of record.`,
      },
    ],
  },
};
