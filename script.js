let cards = [...document.querySelectorAll(".photo-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const emptyState = document.querySelector("#empty-state");
const photoGrid = document.querySelector("#photo-grid");
const photoUpload = document.querySelector("#photo-upload");
const photoCount = document.querySelector("#photo-count");
const uploadStatus = document.querySelector("#upload-status");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxTitle = lightbox.querySelector("figcaption strong");
const lightboxPlace = lightbox.querySelector("figcaption span");
let visibleCards = cards;
let activeIndex = 0;

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    visibleCards = cards.filter((card) => filter === "all" || card.dataset.category === filter);
    cards.forEach((card) => {
      card.hidden = !visibleCards.includes(card);
    });
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    emptyState.hidden = visibleCards.length > 0;
  });
});

function showPhoto(index) {
  activeIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[activeIndex];
  lightboxImage.src = card.dataset.image;
  lightboxImage.alt = card.querySelector("img").alt;
  lightboxTitle.textContent = card.dataset.title;
  lightboxPlace.textContent = card.dataset.place;
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    visibleCards = cards.filter((item) => !item.hidden);
    showPhoto(visibleCards.indexOf(card));
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".previous").addEventListener("click", () => showPhoto(activeIndex - 1));
lightbox.querySelector(".next").addEventListener("click", () => showPhoto(activeIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
  if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
});

document.querySelector("#upload-button").addEventListener("click", () => photoUpload.click());

photoUpload.addEventListener("change", () => {
  const files = [...photoUpload.files].filter((file) => file.type.startsWith("image/"));

  files.forEach((file) => {
    const imageUrl = URL.createObjectURL(file);
    const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
    const card = document.createElement("button");
    card.className = "photo-card photo-card-square";
    card.type = "button";
    card.dataset.category = "uploaded";
    card.dataset.title = title || "Yeni fotoğraf";
    card.dataset.place = "Yeni eklenen";
    card.dataset.image = imageUrl;
    card.setAttribute("aria-label", `${card.dataset.title} fotoğrafını aç`);
    card.innerHTML = '<img loading="lazy" alt=""><span class="photo-overlay"><span><strong></strong><small>Yeni eklenen</small></span><span class="open-mark" aria-hidden="true">↗</span></span>';
    card.querySelector("img").src = imageUrl;
    card.querySelector("img").alt = card.dataset.title;
    card.querySelector(".photo-overlay strong").textContent = card.dataset.title;
    photoGrid.append(card);
    cards.push(card);
    card.addEventListener("click", () => {
      visibleCards = cards.filter((item) => !item.hidden);
      showPhoto(visibleCards.indexOf(card));
      lightbox.showModal();
    });
  });

  if (files.length) {
    filterButtons.find((button) => button.dataset.filter === "all").click();
    photoCount.textContent = String(cards.length).padStart(2, "0");
    uploadStatus.textContent = `${files.length} fotoğraf önizleme olarak eklendi; sayfayı yenileyince kaldırılır.`;
  }

  photoUpload.value = "";
});