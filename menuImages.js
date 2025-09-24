// menuImages.js
const menu_img = [
  "https://files.catbox.moe/p4yxcn.png",
  "https://files.catbox.moe/4pwzoy.jpg",
  "https://files.catbox.moe/17zl1n.jpg",
  "https://files.catbox.moe/lvajp1.jpg",
  "https://files.catbox.moe/cqbawf.jpg",
  "https://files.catbox.moe/fel3m6.jpg",
  "https://files.catbox.moe/d94odw.jpg",
  "https://files.catbox.moe/8b98gq.jpg",
  "https://files.catbox.moe/7wjb33.jpg",
  "https://files.catbox.moe/wez6jk.jpg"
];

// Function to pick a random URL
function getRandomMenuImage() {
  return menu_img[Math.floor(Math.random() * menu_img.length)];
}

module.exports = getRandomMenuImage;