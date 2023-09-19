interface IEmail {
  title: string;
  text: string;
  lang?: string;
  code?: string;
  link?: string;
  textLink?: string;
}

const LOGO =
  "https://res.cloudinary.com/dollarmarket/image/upload/v1695146184/mago/icon_b7wzen.png";

const linkButton = (link: string, textLink: string) => {
  return `<a href="${link}" style="background-color: #D62645; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">${textLink}</a>`;
};

const template = ({
  title,
  text,
  lang = "en",
  code,
}: IEmail) => {
  return `
    <div style="text-align: center; padding: 20px;">
      <a href="https://mago.io/" style="padding-left:0;">
        <img src="${LOGO}" alt="Mago Logo" style="width: 100px; height: 100px; object-fit: contain;"/>
      </a>
      <br />
      <h1 style="font-size: 24px; margin: 0; padding: 0; font-family: 'AudioWide', cursive;">mago</h1>
      <br />
      <h3 style="font-size: 18px; margin: 0; padding: 0; font-family: 'lato', sans-serif;">${title}</h3>
      <br />
      <div style="text-align: left; padding: 20px; ">
        <p style="font-size: 16px; margin: 0; padding: 0;">${text}</p>
        ${
          code
            ? `<p style="text-align: center; font-size: 16px; margin: 0; padding: 0; background-color: #D62645; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">${code}</p>`
            : ""
        }
      </div>
    </div>
  `;
};

const emailMessage = ({
  title,
  text,
  code,
  lang = "en",
  link,
  textLink,
}: IEmail) => {
  const withLink = link && textLink ? linkButton(link, textLink) : "";
  return template({ title, text: text + withLink, lang, code });
};

export default emailMessage;