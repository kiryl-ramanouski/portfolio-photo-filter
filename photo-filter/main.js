// script for fullscreen
document.querySelector(".fullscreen").addEventListener("click", toggleFullScreen);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    }
    else if (document.exitFullscreen) {
        document.exitFullscreen();
    };
}

//script for switching buttons classes
document.querySelector(".btn-container").addEventListener("click", changeButtonToActive);

function changeButtonToActive(event) {
    if (event.target.classList.contains("btn-container")) {return};
    document.querySelectorAll(".btn-active").forEach(item => item.classList.remove("btn-active"));
    if (event.target.classList.contains("btn-load--input")) {
        document.querySelector(".btn-load").classList.add("btn-active");
    }
    event.target.classList.add("btn-active");
}

//script for filters
document.querySelectorAll(".filters input").forEach(input => input.addEventListener("change", handleUpdate));
document.querySelectorAll(".filters input").forEach(input => input.addEventListener("mousemove", handleUpdate));
document.querySelectorAll(".filters input").forEach(input => input.addEventListener("change", resultUpdate));
document.querySelectorAll(".filters input").forEach(input => input.addEventListener("mousemove", resultUpdate));

function handleUpdate() {
    const suffix = this.dataset.sizing;
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
    drawImage();
}

function resultUpdate() {
    const outputs = document.querySelectorAll(".filters output");
    outputs.forEach(output => output.name == this.name ? output.value = this.value : output.value);
}

//script for reset button
document.querySelector(".btn-reset").addEventListener("click", resetValues);

function resetValues() {
    const outputs = document.querySelectorAll(".filters output");
    outputs.forEach(output => output.name == "saturate" ? output.value = 100 : output.value = 0);
    const inputs = document.querySelectorAll(".filters input");
    inputs.forEach(input => input.name == "saturate" ? input.value = 100 : input.value = 0);
    document.documentElement.style.setProperty("--blur", "0px");
    document.documentElement.style.setProperty("--invert", "0%");
    document.documentElement.style.setProperty("--sepia", "0%");
    document.documentElement.style.setProperty("--saturate", "100%");
    document.documentElement.style.setProperty("--hue", "0deg");
    drawImage();
}

//script for next picture button
document.querySelector(".btn-next").addEventListener("click", changePictureToNext);
let index = 0;

function changePictureToNext() {
    const currentPicture = document.querySelector(".container-for-image img");
    const base = "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
    const images = ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg", "09.jpg", "10.jpg",
                    "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg"];
    let pictureIndex = index % images.length;
    let currentPartOfTheDay = "evening/";
    let currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) {currentPartOfTheDay = "morning/"};
    if (currentHour >= 12 && currentHour < 18) {currentPartOfTheDay = "day/"};
    if (currentHour >= 18 && currentHour < 24) {currentPartOfTheDay = "evening/"};
    if (currentHour >= 0 && currentHour < 6) {currentPartOfTheDay = "night/"};
    currentPicture.src = base + currentPartOfTheDay + images[pictureIndex];
    index++;
}

//script for load picture button
const input = document.querySelector(`input[type="file"]`);
const imageContainer = document.querySelector(".container-for-image");
input.addEventListener("change", loadPicture);

function loadPicture() {
    let file = input.files[0];
    let reader = new FileReader();
    reader.onload = () => {
        let img = new Image();
        img.src = reader.result;
        imageContainer.innerHTML = "";
        imageContainer.append(img);
        drawImage();
    }
    reader.readAsDataURL(file);
    input.value = "";
}

//script for save picture button
//drow copy of current image in canvas element
const canvas = document.querySelector("canvas");
document.querySelector(".btn-next").addEventListener("click", drawImage);

function drawImage() {
  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  let currentImage = document.querySelector(".container-for-image>img")
  img.src = currentImage.src;
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    let style = getComputedStyle(document.querySelector(".container-for-image>img"));
    let filters = style.getPropertyValue("filter");
    ctx.filter = filters;
    ctx.drawImage(img, 0, 0);
  };  
}

//download copy from canvas
document.querySelector(".btn-save").addEventListener("click", downloadImage);

function downloadImage() {
    let link = document.createElement("a");
    link.download = "download.png";
    link.href = "/photo-filter/assets/img/img.jpg"
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}
drawImage();
