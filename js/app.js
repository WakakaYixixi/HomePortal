const services = [
  {
    name: "NAS",
    description: "Synology DSM",
    url: "https://nas.maskpic.com",
    icon: "server",
  },
  {
    name: "QQBot",
    description: "Bot Management",
    url: "https://qqbot.maskpic.com",
    icon: "bot",
  },
  {
    name: "Janken",
    description: "Rock Paper Scissors",
    url: "https://janken.maskpic.com",
    icon: "game",
  },
  {
    name: "Speed Test",
    description: "Network Speed Test",
    url: "https://speed.maskpic.com",
    icon: "speed",
  },
];

const grid = document.querySelector("#services-grid");
const count = document.querySelector("#service-count");

function createIcon(iconName, className) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  svg.classList.add(className);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  use.setAttribute("href", `#icon-${iconName}`);
  svg.append(use);

  return svg;
}

function createServiceCard(service) {
  const card = document.createElement("a");
  const iconWrap = document.createElement("span");
  const copy = document.createElement("span");
  const nameRow = document.createElement("span");
  const name = document.createElement("span");
  const description = document.createElement("span");

  card.className = "service-card";
  card.href = service.url;
  card.setAttribute("aria-label", `${service.name}: ${service.description}`);

  iconWrap.className = "service-icon-wrap";
  iconWrap.append(createIcon(service.icon, "service-icon"));

  copy.className = "service-copy";
  nameRow.className = "service-name-row";
  name.className = "service-name";
  name.textContent = service.name;
  description.className = "service-description";
  description.textContent = service.description;

  nameRow.append(name, createIcon("arrow", "service-arrow"));
  copy.append(nameRow, description);
  card.append(iconWrap, copy);

  return card;
}

const fragment = document.createDocumentFragment();
services.forEach((service) => fragment.append(createServiceCard(service)));
grid.append(fragment);
count.textContent = `${services.length} services`;
