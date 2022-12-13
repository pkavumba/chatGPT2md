import TurndownService from "turndown";

const turndownService = new TurndownService();

const sidebarNav = document.querySelector("nav");

if (sidebarNav) {
  let btn = document.createElement("button");
  btn.textContent = "Save Chat";
  btn.style.paddingBottom = "15px";
  btn.onclick = saveChat;

  sidebarNav.appendChild(btn);
}

function saveChat() {
  const chat = document.evaluate(
    `//*[@id="__next"]/div/div[1]/main/div[1]/div/div/div`,
    document.body,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  const chat_elem = chat.singleNodeValue;
  const markdown = turndownService.turndown(chat_elem);
  download(markdown);
}

function download(md: string) {
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(new Blob([md], { type: "text/plain" }));
  const date = new Date();
  a.download = `Chat with chatGPT ${Date()}.md`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function getChats() {
  const chats = document.evaluate(
    `//*[@id="__next"]/div/div[1]/main/div[1]/div/div/div/div`,
    document.body,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  let md_chats = [];

  for (let i = 0; i < chats.snapshotLength; i++) {
    let node = chats.snapshotItem(i);
    node = node.cloneNode(true);
    if (i == chats.snapshotLength - 1) {
    } else if (i % 2 == 0) {
      md_chats.push("You\n" + turndownService.turndown(node));
    } else {
      md_chats.push("chatGPT\n" + turndownService.turndown(node));
    }
  }

  return md_chats.join("\n\n");
}
