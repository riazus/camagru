import { accountService } from "./_services/account.js";
import { postService } from "./_services/post.js";

window.alert = (errorMessage, timeout = null) => {
  const alert = document.createElement("div");
  const alertButton = document.createElement("button");
  alertButton.innerText = "OK";
  alert.classList.add("alert");
  alert.setAttribute(
    "style",
    `
    position:fixed;
    top: 100px;
    left: 50%;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 5px 0 #00000022;
    display:flex;
    flex-direction:column;
    border: 1px solid #333;
    transform: translateX(-50%);
    background: #212529;
    text-align: center;
  `
  );

  alertButton.classList.add("btn", "btn-outline-light", "btn-lg", "px-5");
  alert.innerHTML = `<span style="color:azure;padding:10px;">${errorMessage}</span>`;
  alert.appendChild(alertButton);

  alertButton.addEventListener("click", (e) => {
    alert.remove();
  });

  if (timeout != null) {
    setTimeout(() => {
      alert.remove();
    }, Number(timeout));
  }

  document.body.appendChild(alert);
};

//#region CREATEPOST.JS

const pixelToPercentage = (px, parentSize) => {
  return (px * 100) / parentSize;
};

const percentageToPixel = (percentage, parentSize) => {
  return (percentage * parentSize) / 100;
};

let mediaStream = null;

const stopWebcam = (
  videoElement,
  noWebcamElement,
  imageElement,
  liveStickerContainer
) => {
  if (mediaStream !== null) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  if (videoElement !== undefined) {
    videoElement.classList.add("d-none");
    noWebcamElement.classList.add("d-none");
    imageElement.classList.remove("d-none");
    liveStickerContainer.classList.remove("d-none");
  }
};

const setCreatePost = async () => {
  const videoElement = document.getElementById("webcam");
  const noWebcamElement = document.getElementById("no-webcam");
  const imageElement = document.getElementById("image");
  const imageInput = document.getElementById("image-input");
  const captureButton = document.getElementById("capture-button");
  const uploadButton = document.getElementById("upload-button");
  const postButton = document.getElementById("post-button");
  const cancelButton = document.getElementById("cancel-button");
  const saveButton = document.getElementById("save-button");
  const middleCol = document.getElementById("middle-col");
  const stickerContainerAbove = document.getElementById(
    "sticker-container-above"
  );
  const stickerContainerVertical = document.getElementById("sticker-container");
  const stickerContainerHorizontal = document.getElementById(
    "sticker-container-horizontal"
  );
  let stickerContainer =
    window.innerWidth < 576
      ? stickerContainerHorizontal
      : stickerContainerVertical;
  const previewContainerVertical = document.getElementById("preview-container");
  const previewContainerHorizontal = document.getElementById(
    "preview-container-horizontal"
  );
  let previewContainer =
    window.innerWidth < 576
      ? previewContainerHorizontal
      : previewContainerVertical;
  previewContainer.classList.remove("d-none");
  const mainContainer = document.getElementById("main-container");
  const stickerElements = document.getElementsByClassName("sticker");
  const liveStickerContainer = document.getElementById(
    "live-sticker-container"
  );
  let LSCwidth;
  let LSCheight;
  let captureMode = true;

  if (stickerContainer === stickerContainerHorizontal) {
    stickerContainerAbove.style.height = "15vh";
    stickerContainerAbove.classList.add("justify-content-center");
  }

  const startWebcam = async () => {
    // USE WITH AWAIT
    imageElement.classList.add("d-none");
    liveStickerContainer.classList.add("d-none");
    try {
      const constraints = { video: true };
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = mediaStream;
      videoElement.classList.remove("d-none");
      noWebcamElement.classList.add("d-none");
      captureButton.disabled = false;
    } catch (error) {
      videoElement.classList.add("d-none");
      noWebcamElement.classList.remove("d-none");
      captureButton.disabled = true;
    }
  };
  await startWebcam();

  const changeMode = async () => {
    // USE WITH AWAIT
    captureMode = !captureMode;
    if (captureMode) {
      const liveStickers = mainContainer.querySelectorAll(".live-sticker");
      for (let i = 0; i < liveStickers.length; i++) {
        const liveSticker = liveStickers[i];
        liveSticker.remove();
      }
      await startWebcam();
      captureButton.classList.remove("d-none");
      uploadButton.classList.remove("d-none");
      postButton.classList.add("d-none");
      middleCol.classList.add("d-none");
      saveButton.classList.add("d-none");
      previewContainer.classList.remove("d-none");
      stickerContainer.classList.add("d-none");
      postButton.disabled = true;
    } else {
      stopWebcam(
        videoElement,
        noWebcamElement,
        imageElement,
        liveStickerContainer
      );
      captureButton.classList.add("d-none");
      uploadButton.classList.add("d-none");
      postButton.classList.remove("d-none");
      middleCol.classList.remove("d-none");
      saveButton.classList.remove("d-none");
      previewContainer.classList.add("d-none");
      stickerContainer.classList.remove("d-none");
      saveButton.disabled = false;
      cancelButton.disabled = false;
    }
  };

  const createPreview = (imageUrl) => {
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    const colElement = document.createElement("div");
    colElement.classList.add("col");
    colElement.classList.add("mx-2");
    colElement.classList.add("my-3");
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.classList.add("preview-image");

    previewContainerVertical.appendChild(rowElement);
    rowElement.appendChild(colElement);
    colElement.appendChild(imageElement);

    const horizontalRowElement =
      previewContainerHorizontal.querySelector(".row");
    const horizontalColElement = document.createElement("div");
    horizontalColElement.classList.add("col-4");
    const horizontalImageElement = document.createElement("img");
    horizontalImageElement.src = imageUrl;
    horizontalImageElement.classList.add("preview-image");
    horizontalImageElement.style.maxHeight = "12vh";

    horizontalRowElement.appendChild(horizontalColElement);
    horizontalColElement.appendChild(horizontalImageElement);
  };

  const setLiveStickerContainer = (wait = true) => {
    const func = () => {
      const imageHeight = imageElement.offsetHeight;
      const imageWidth =
        (imageElement.offsetHeight * imageElement.naturalWidth) /
        imageElement.naturalHeight;
      liveStickerContainer.style.left = `${
        (mainContainer.offsetWidth - imageWidth) / 2
      }px`;
      liveStickerContainer.style.top = `${
        (mainContainer.offsetHeight - imageHeight) / 2
      }px`;
      liveStickerContainer.style.width = `${imageWidth}px`;
      liveStickerContainer.style.height = `${imageHeight}px`;
      LSCwidth = imageWidth;
      LSCheight = imageHeight;
    };

    if (wait) {
      setTimeout(() => {
        func();
      }, 1);
    } else {
      func();
    }
  };

  captureButton.addEventListener("click", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    imageElement.src = canvas.toDataURL();
    setLiveStickerContainer();
    canvas.remove();
    createPreview(imageElement.src);
    await changeMode();
  });

  uploadButton.addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      imageElement.src = event.target.result;
      setLiveStickerContainer();
      createPreview(imageElement.src);
    };
    reader.readAsDataURL(file);
    imageInput.value = "";
    await changeMode();
  });

  cancelButton.addEventListener("click", async () => {
    postButton.disabled = true;
    saveButton.disabled = true;
    cancelButton.disabled = true;
    await changeMode();
  });

  saveButton.addEventListener("click", async () => {
    const stickerInformation = [];
    const liveStickers = mainContainer.querySelectorAll(".live-sticker");
    const rectContainer = liveStickerContainer.getBoundingClientRect();

    for (let i = 0; i < liveStickers.length; i++) {
      const liveSticker = liveStickers[i];
      const rect = liveSticker.getBoundingClientRect();
      const stickerLeftPixel = Math.floor(rect.left - rectContainer.left);
      const stickerTopPixel = Math.floor(rect.top - rectContainer.top);
      const stickerWidthPixel = Math.floor(rect.width);
      const stickerHeightPixel = Math.floor(rect.height);

      stickerInformation.push({
        image: extractString(elementToBase64(liveSticker)),
        x: stickerLeftPixel,
        y: stickerTopPixel,
        width: stickerWidthPixel,
        height: stickerHeightPixel,
      });
    }

    const imageBlob = await postService.uploadImage({
      baseImage: extractString(imageElement.src),
      height: imageElement.offsetHeight,
      stickerArray: JSON.stringify(stickerInformation),
    });

    const imageUrl = URL.createObjectURL(imageBlob);
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = "camagru.png";
    anchor.click();
    anchor.remove();
  });

  document.addEventListener("click", async (event) => {
    // Preview Images Click Event
    if (event.target.classList.contains("preview-image")) {
      imageElement.src = event.target.src;
      setLiveStickerContainer();
      await changeMode();
    }
  });

  // Sticker Element Click Event
  for (let i = 0; i < stickerElements.length; i++) {
    const stickerElement = stickerElements[i];
    stickerElement.addEventListener("click", (event) => {
      const newSticker = document.createElement("img");
      newSticker.src = event.target.src;
      newSticker.classList.add("live-sticker");
      newSticker.draggable = false;
      newSticker.style.left = `0px`;
      newSticker.style.top = `0px`;
      newSticker.style.width = `20%`;
      newSticker.style.height = "auto";
      setTimeout(() => {
        newSticker.style.height = heightToPercentage(
          newSticker.style.height,
          newSticker.style.width,
          newSticker.naturalWidth / newSticker.naturalHeight,
          LSCheight,
          LSCwidth
        );
      }, 1);
      liveStickerContainer.appendChild(newSticker);
      postButton.disabled = false;
    });
  }

  // Live Stickers
  let currentLiveSticker = null;
  let resizeDirection = null;
  let prevX = 0;
  let prevY = 0;

  const changeToPixel = (value, parentSize) => {
    if (value[value.length - 1] === "%") {
      value = `${percentageToPixel(parseInt(value), parentSize)}px`;
    }
    return value;
  };

  const changeToPercentage = (value, parentSize) => {
    if (value[value.length - 1] === "x" && value[value.length - 2] === "p") {
      value = `${pixelToPercentage(parseInt(value), parentSize)}%`;
    }
    return value;
  };

  const heightToPixel = (
    height,
    width,
    aspectRatio,
    parentHeight,
    parentWidth
  ) => {
    if (height === "auto") {
      const widthPixel = parseInt(changeToPixel(width, parentWidth));
      height = `${widthPixel / aspectRatio}px`;
      return height;
    } else {
      return changeToPixel(height, parentHeight);
    }
  };

  const heightToPercentage = (
    height,
    width,
    aspectRatio,
    parentHeight,
    parentWidth
  ) => {
    height = heightToPixel(
      height,
      width,
      aspectRatio,
      parentHeight,
      parentWidth
    );
    return changeToPercentage(height, parentHeight);
  };

  const handleMouseDown = (event) => {
    if (event.target.classList.contains("live-sticker")) {
      event.preventDefault();
      currentLiveSticker = event.target;
      if (event.type === "mousedown") {
        prevX = event.clientX;
        prevY = event.clientY;
      } else if (event.type === "touchstart") {
        const touch = event.touches[0];
        prevX = Math.floor(touch.clientX);
        prevY = Math.floor(touch.clientY);
      }

      if (event.type === "mousedown") {
        if (event.target.style.cursor === "auto") {
          resizeDirection = null;
        } else if (event.target.style.cursor === "n-resize") {
          resizeDirection = "top";
        } else if (event.target.style.cursor === "s-resize") {
          resizeDirection = "bottom";
        } else if (event.target.style.cursor === "w-resize") {
          resizeDirection = "left";
        } else if (event.target.style.cursor === "e-resize") {
          resizeDirection = "right";
        }
      } else if (event.type === "touchstart") {
        const touch = event.touches[0];
        const { left, top, right, bottom } =
          event.target.getBoundingClientRect();
        const borderRatio = 20 / 100;
        let borderWidth = Math.floor(
          parseInt(changeToPixel(event.target.style.width, LSCwidth)) *
            borderRatio
        );
        let borderHeight = Math.floor(
          parseInt(changeToPixel(event.target.style.height, LSCheight)) *
            borderRatio
        );
        if (borderHeight < 2) {
          borderHeight = 2;
        }
        if (borderWidth < 2) {
          borderWidth = 2;
        }

        if (
          Math.floor(touch.clientY) >= top &&
          Math.floor(touch.clientY) <= top + borderHeight
        ) {
          resizeDirection = "top";
        } else if (
          Math.floor(touch.clientY) >= bottom - borderHeight &&
          Math.floor(touch.clientY) <= bottom
        ) {
          resizeDirection = "bottom";
        } else if (
          Math.floor(touch.clientX) >= left &&
          Math.floor(touch.clientX) <= left + borderWidth
        ) {
          resizeDirection = "left";
        } else if (
          Math.floor(touch.clientX) >= right - borderWidth &&
          Math.floor(touch.clientX) <= right
        ) {
          resizeDirection = "right";
        } else {
          resizeDirection = null;
        }
      }
    }
  };
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("touchstart", handleMouseDown, { passive: false });

  const handleMouseUp = () => {
    if (currentLiveSticker) {
      const liveStickers = mainContainer.querySelectorAll(".live-sticker");
      const destroyRatio = 2 / 3;
      if (parseInt(currentLiveSticker.style.left) < 0) {
        if (
          parseInt(currentLiveSticker.style.left) >
          0 - currentLiveSticker.width * destroyRatio
        ) {
          currentLiveSticker.style.left = `0px`;
        } else {
          if (liveStickers.length === 1) {
            postButton.disabled = true;
          }
          currentLiveSticker.remove();
        }
      } else if (
        parseInt(currentLiveSticker.style.left) >
        LSCwidth - currentLiveSticker.width
      ) {
        if (
          parseInt(currentLiveSticker.style.left) <
          LSCwidth -
            currentLiveSticker.width +
            currentLiveSticker.width * destroyRatio
        ) {
          currentLiveSticker.style.left = `${
            LSCwidth - currentLiveSticker.width
          }px`;
        } else {
          if (liveStickers.length === 1) {
            postButton.disabled = true;
          }
          currentLiveSticker.remove();
        }
      }
      if (parseInt(currentLiveSticker.style.top) < 0) {
        if (
          parseInt(currentLiveSticker.style.top) >
          0 - currentLiveSticker.height * destroyRatio
        ) {
          currentLiveSticker.style.top = `0px`;
        } else {
          if (liveStickers.length === 1) {
            postButton.disabled = true;
          }
          currentLiveSticker.remove();
        }
      } else if (
        parseInt(currentLiveSticker.style.top) >
        LSCheight - currentLiveSticker.height
      ) {
        if (
          parseInt(currentLiveSticker.style.top) <
          LSCheight -
            currentLiveSticker.height +
            currentLiveSticker.height * destroyRatio
        ) {
          currentLiveSticker.style.top = `${
            LSCheight - currentLiveSticker.height
          }px`;
        } else {
          if (liveStickers.length === 1) {
            postButton.disabled = true;
          }
          currentLiveSticker.remove();
        }
      }
      currentLiveSticker = null;
      resizeDirection = null;
    }
  };
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchend", handleMouseUp);

  const handleMouseMove = (event) => {
    if (!captureMode) {
      if (currentLiveSticker) {
        event.preventDefault();
        const minumumWidth = 10; // Percentage (also Height)
        let newX;
        let newY;
        if (event.type === "mousemove") {
          newX = prevX - event.clientX;
          newY = prevY - event.clientY;
        } else if (event.type === "touchmove") {
          const touch = event.touches[0];
          newX = prevX - Math.floor(touch.clientX);
          newY = prevY - Math.floor(touch.clientY);
        }

        // Moving the sticker
        if (!resizeDirection) {
          currentLiveSticker.style.left = `${
            parseInt(changeToPixel(currentLiveSticker.style.left, LSCwidth)) -
            newX
          }px`;
          currentLiveSticker.style.top = `${
            parseInt(changeToPixel(currentLiveSticker.style.top, LSCheight)) -
            newY
          }px`;
        }

        // Resizing the sticker
        else if (resizeDirection === "right") {
          const oldWidth = currentLiveSticker.style.width;
          currentLiveSticker.style.width = `${
            parseInt(changeToPixel(currentLiveSticker.style.width, LSCwidth)) -
            newX
          }px`;
          if (
            parseInt(changeToPixel(currentLiveSticker.style.left)) >
            LSCwidth - parseInt(currentLiveSticker.width)
          ) {
            currentLiveSticker.style.width = oldWidth;
          }
          if (
            parseInt(
              changeToPercentage(currentLiveSticker.style.width, LSCwidth)
            ) < minumumWidth
          ) {
            currentLiveSticker.style.width = oldWidth;
          }
        } else if (resizeDirection === "left") {
          const oldWidth = currentLiveSticker.style.width;
          const oldLeft = currentLiveSticker.style.left;
          currentLiveSticker.style.width = `${
            parseInt(changeToPixel(currentLiveSticker.style.width, LSCwidth)) +
            newX
          }px`;
          currentLiveSticker.style.left = `${
            parseInt(changeToPixel(currentLiveSticker.style.left, LSCwidth)) -
            newX
          }px`;
          if (parseInt(changeToPixel(currentLiveSticker.style.left)) < 0) {
            currentLiveSticker.style.width = oldWidth;
            currentLiveSticker.style.left = oldLeft;
          }
          if (
            parseInt(
              changeToPercentage(currentLiveSticker.style.width, LSCwidth)
            ) < minumumWidth
          ) {
            currentLiveSticker.style.width = oldWidth;
            currentLiveSticker.style.left = oldLeft;
          }
        } else if (resizeDirection === "bottom") {
          const oldHeight = currentLiveSticker.style.height;
          currentLiveSticker.style.height = `${
            parseInt(
              changeToPixel(currentLiveSticker.style.height, LSCheight)
            ) - newY
          }px`;
          if (
            parseInt(changeToPixel(currentLiveSticker.style.top)) >
            LSCheight - parseInt(currentLiveSticker.height)
          ) {
            currentLiveSticker.style.height = oldHeight;
          }
          if (
            parseInt(
              changeToPercentage(currentLiveSticker.style.height, LSCheight)
            ) < minumumWidth
          ) {
            currentLiveSticker.style.height = oldHeight;
          }
        } else if (resizeDirection === "top") {
          const oldHeight = currentLiveSticker.style.height;
          const oldTop = currentLiveSticker.style.top;
          currentLiveSticker.style.height = `${
            parseInt(
              changeToPixel(currentLiveSticker.style.height, LSCheight)
            ) + newY
          }px`;
          currentLiveSticker.style.top = `${
            parseInt(changeToPixel(currentLiveSticker.style.top, LSCwidth)) -
            newY
          }px`;
          if (parseInt(changeToPixel(currentLiveSticker.style.top)) < 0) {
            currentLiveSticker.style.height = oldHeight;
            currentLiveSticker.style.top = oldTop;
          }
          if (
            parseInt(
              changeToPercentage(currentLiveSticker.style.height, LSCheight)
            ) < minumumWidth
          ) {
            currentLiveSticker.style.height = oldHeight;
            currentLiveSticker.style.top = oldTop;
          }
        }
        if (event.type === "mousemove") {
          prevX = event.clientX;
          prevY = event.clientY;
        } else if (event.type === "touchmove") {
          const touch = event.touches[0];
          prevX = Math.floor(touch.clientX);
          prevY = Math.floor(touch.clientY);
        }
      }

      if (event.type === "mousemove") {
        // Cursor Changes
        if (event.target.classList.contains("live-sticker")) {
          if (!resizeDirection) {
            const { left, top, right, bottom } =
              event.target.getBoundingClientRect();
            const borderRatio = 10 / 100;
            let borderWidth = Math.floor(
              parseInt(changeToPixel(event.target.style.width, LSCwidth)) *
                borderRatio
            );
            let borderHeight = Math.floor(
              parseInt(changeToPixel(event.target.style.height, LSCheight)) *
                borderRatio
            );
            if (borderHeight < 2) {
              borderHeight = 2;
            }
            if (borderWidth < 2) {
              borderWidth = 2;
            }

            if (event.clientY >= top && event.clientY <= top + borderHeight) {
              event.target.style.cursor = "n-resize";
            } else if (
              event.clientY >= bottom - borderHeight &&
              event.clientY <= bottom
            ) {
              event.target.style.cursor = "s-resize";
            } else if (
              event.clientX >= left &&
              event.clientX <= left + borderWidth
            ) {
              event.target.style.cursor = "w-resize";
            } else if (
              event.clientX >= right - borderWidth &&
              event.clientX <= right
            ) {
              event.target.style.cursor = "e-resize";
            } else {
              event.target.style.cursor = "auto";
            }
          }
        }
      }
    }
  };
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("touchmove", handleMouseMove, { passive: false });

  window.addEventListener("resize", () => {
    const liveStickers = mainContainer.querySelectorAll(".live-sticker");
    for (let i = 0; i < liveStickers.length; i++) {
      const liveSticker = liveStickers[i];
      liveSticker.style.left = changeToPercentage(
        liveSticker.style.left,
        LSCwidth
      );
      liveSticker.style.top = changeToPercentage(
        liveSticker.style.top,
        LSCheight
      );
      liveSticker.style.width = changeToPercentage(
        liveSticker.style.width,
        LSCwidth
      );
      liveSticker.style.height = changeToPercentage(
        liveSticker.style.height,
        LSCheight
      );
    }
    setLiveStickerContainer(false);

    const oldStickerContainer = stickerContainer;
    stickerContainer =
      window.innerWidth < 576
        ? stickerContainerHorizontal
        : stickerContainerVertical;
    if (
      stickerContainer !== oldStickerContainer &&
      !oldStickerContainer.classList.contains("d-none")
    ) {
      oldStickerContainer.classList.add("d-none");
      stickerContainer.classList.remove("d-none");
    }

    const oldPreviewContainer = previewContainer;
    previewContainer =
      window.innerWidth < 576
        ? previewContainerHorizontal
        : previewContainerVertical;
    if (
      previewContainer !== oldPreviewContainer &&
      !oldPreviewContainer.classList.contains("d-none")
    ) {
      oldPreviewContainer.classList.add("d-none");
      previewContainer.classList.remove("d-none");
    }

    if (stickerContainer === stickerContainerHorizontal) {
      stickerContainerAbove.style.height = "15vh";
      stickerContainerAbove.classList.add("justify-content-center");
    } else {
      stickerContainerAbove.style.height = "70vh";
      stickerContainerAbove.classList.remove("justify-content-center");
    }
  });

  // Sticker to Base64
  const elementToBase64 = (imgElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    ctx.drawImage(imgElement, 0, 0);
    const base64String = canvas.toDataURL();
    canvas.remove();
    return base64String;
  };
  const extractString = (base64String) => {
    const parts = base64String.split(",");
    if (parts.length === 2) {
      return parts[1];
    } else {
      return base64String;
    }
  };
  // Post button
  postButton.addEventListener("click", async () => {
    const stickerInformation = [];
    const liveStickers = mainContainer.querySelectorAll(".live-sticker");
    const rectContainer = liveStickerContainer.getBoundingClientRect();

    for (let i = 0; i < liveStickers.length; i++) {
      const liveSticker = liveStickers[i];
      const rect = liveSticker.getBoundingClientRect();
      const stickerLeftPixel = Math.floor(rect.left - rectContainer.left);
      const stickerTopPixel = Math.floor(rect.top - rectContainer.top);
      const stickerWidthPixel = Math.floor(rect.width);
      const stickerHeightPixel = Math.floor(rect.height);

      stickerInformation.push({
        image: extractString(elementToBase64(liveSticker)),
        x: stickerLeftPixel,
        y: stickerTopPixel,
        width: stickerWidthPixel,
        height: stickerHeightPixel,
      });
    }

    let currUser;
    const item = localStorage.getItem("currentUser");
    if (item && item !== "undefined") {
      currUser = JSON.parse(item);
    }

    try {
      const imageResponse = await postService.uploadImageForUser({
        userId: currUser.id,
        baseImage: extractString(imageElement.src),
        height: imageElement.offsetHeight,
        stickerArray: JSON.stringify(stickerInformation),
      });

      await postService.createNewPost({ fileName: imageResponse.fileName });
      alert("Post created successfully!");
      setTimeout(() => {
        window.location.replace("/");
      }, 3000);
    } catch (err) {
      alert(err);
    }
  });
};
//#endregion

const determineDate = (dateString) => {
  const date = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = Math.abs(currentDate - date);

  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference > 0) {
    return `${daysDifference} DAY${daysDifference > 1 ? "S" : ""} AGO`;
  } else if (hoursDifference > 0) {
    return `${hoursDifference} HOUR${hoursDifference > 1 ? "S" : ""} AGO`;
  } else if (minutesDifference > 0) {
    return `${minutesDifference} MINUTE${minutesDifference > 1 ? "S" : ""} AGO`;
  } else {
    return "RIGHT NOW";
  }
};

const convertStringToElement = (htmlString) => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(htmlString, "text/html");
  return parsedDocument.body.firstChild;
};

let lastPostId = null;
const loadPosts = async (container, userId, reset = false) => {
  const isDialogSupported = typeof HTMLDialogElement !== 'undefined';
  let posts;

  if (reset) {
    lastPostId = null;
  }

  posts = await postService.getChunkPosts(lastPostId);

  if (posts.length <= 0) {
    return;
  }

  lastPostId = posts[posts.length - 1].id;

  const postElement = convertStringToElement(
    await (await fetch(`html/mains/post.html`)).text()
  );

  let isLogged = false;

  let currUser;
  const item = localStorage.getItem("currentUser");
  if (item && item !== "undefined") {
    currUser = JSON.parse(item);
  }

  if (currUser) {
    isLogged = true;
  }

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const newElement = postElement.cloneNode(true);

    const creatorElement = newElement.querySelector('#post-username');
    const likeCountElement = newElement.querySelector('#like-count');
    const timeCreatedElement = newElement.querySelector("#post-date");
    const imageElement = newElement.querySelector('#post-image');
    const likeElement = newElement.querySelector("#like-post");
    const commentForm = newElement.querySelector("#comment-form");
    const commentContainer = newElement.querySelector("#comment-container");
    const deleteButton = newElement.querySelector('#erase-post');
    const deleteDialog = newElement.querySelector("#erase-dialog");
    
    if (!isDialogSupported) {
      deleteDialog.remove();
    }

    creatorElement.textContent = post.username;
    likeCountElement.textContent = post.likes;
    timeCreatedElement.textContent = determineDate(post.createDate);
    imageElement.src = "images/" + post.imagePath;
    commentContainer.setAttribute("post-id", post.id.toString());

    newElement.setAttribute("post-id", post.id.toString());

    if (isLogged) {
      commentForm.setAttribute("post-id", post.id.toString());
      likeElement.setAttribute("post-id", post.id.toString());
      likeCountElement.setAttribute("post-id", post.id.toString());

      const isUserLikedPost = await postService.isUserLikedPost(post.id);
      const likeIcon = likeElement.querySelector("#like-true");
      const dislikeIcon = likeElement.querySelector("#like-false");

      likeIcon.style.pointerEvents = "none";
      dislikeIcon.style.pointerEvents = "none";

      if (isUserLikedPost.isLiked) {
        likeIcon.classList.remove("d-none");
      } else {
        dislikeIcon.classList.remove("d-none");
      }
    } else {
      commentForm.remove();
      likeElement.remove();
      deleteButton.remove();
      if (deleteDialog) {
        deleteDialog.remove();
      }
      const divider2 = newElement.querySelector("#divider-2");
      divider2.remove();
      commentContainer.classList.add("mb-2");
    }

    await loadComments(post.id, commentContainer);

    const divider = newElement.querySelector("#divider");
    const likedText = newElement.querySelector("#liked-count-text");
    if (commentContainer.children.length === 0) {
      divider.classList.add("d-none");
      likedText.classList.remove("mb-2");
    } else {
      divider.classList.remove("d-none");
      likedText.classList.add("mb-2");
    }

    if (isLogged) {
      if (currUser.id == post.userId) {
        deleteButton.classList.remove('d-none');
      }

      const deletePost = async () => {
          await postService.deletePost(post.id);
          newElement.remove();
          const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
          const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
          if ((scrollTop + window.innerHeight) >= scrollHeight) {
            const footer = document.getElementById('footer-section');
            footer.classList.remove('d-none');
            footer.classList.add('fixed-bottom');
          }
      }
      deleteButton.addEventListener('click', () => {
        if (isDialogSupported) {
            deleteDialog.showModal();
            const realDelete = deleteDialog.querySelector('#delete');
            const cancel = deleteDialog.querySelector('#cancel');
            realDelete.addEventListener('click', async () => {
                deletePost();
                deleteDialog.close();
            });
            cancel.addEventListener('click', () => {
                deleteDialog.close();
            });
        }
        else {
            deletePost();
        }
      })
    }

    container.appendChild(newElement);
  }
};

const loadComments = async (
  postId,
  container = document.querySelector(`[post-id="${postId}"]#comment-container`)
) => {
  let firstElement;
  if (container.children.length > 0) {
    firstElement = container.firstChild;
  } else {
    firstElement = null;
  }
  const viewMoreCommentsElement = container.querySelector(
    "#view-more-comments"
  );
  if (viewMoreCommentsElement) {
    container.removeChild(viewMoreCommentsElement);
  }

  let lastCommentId = null;
  if (firstElement != null) {
    const lastElement = container.lastElementChild;
    lastCommentId = parseInt(lastElement.getAttribute("comment-id"));
  }

  let comments;
  if (lastCommentId != null) {
    comments = await postService.getComments({
      postId: postId,
      lastCommentId: lastCommentId,
    });
  } else {
    comments = await postService.getComments({
      postId: postId,
      lastCommentId: 999, //TODO
    });
  }

  const commentElement = convertStringToElement(
    await (await fetch(`html/mains/comment.html`)).text()
  );

  if (!lastCommentId) {
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const newElement = commentElement.cloneNode(true);
      const containerFirstElement = container.firstChild;

      const usernameElement = newElement.querySelector("#comment-username");
      const contentElement = newElement.querySelector("#comment-content");
      const dateElement = newElement.querySelector("#comment-created-date");

      newElement.setAttribute("comment-id", comment.id.toString());
      usernameElement.textContent = `${comment.username}:`;
      contentElement.textContent = comment.comment;
      dateElement.textContent = determineDate(comment.createdDate);

      container.insertBefore(newElement, containerFirstElement);
    }
  } else {
    for (let i = comments.length - 1; i >= 0; i--) {
      const comment = comments[i];
      const newElement = commentElement.cloneNode(true);
      const containerLastElement = container.lastChild;

      const usernameElement = newElement.querySelector("#comment-username");
      const contentElement = newElement.querySelector("#comment-content");
      const dateElement = newElement.querySelector("#comment-created-date");

      newElement.setAttribute("comment-id", comment.id.toString());
      usernameElement.textContent = `${comment.username}:`;
      contentElement.textContent = comment.comment;
      dateElement.textContent = determineDate(comment.createdDate);

      container.append(containerLastElement, newElement);
    }
  }

  const allCommentCount = parseInt(
    (await postService.getPostCommentsCount(postId)).commentsCount
  );

  if (allCommentCount > container.children.length) {
    const viewMoreCommentsHTML = convertStringToElement(
      await (await fetch(`html/mains/view-more-comments.html`)).text()
    );
    const button = viewMoreCommentsHTML.querySelector("#more-comments-button");

    button.setAttribute("post-id", postId.toString());
    button.style.pointerEvents = "pointer";
    container.appendChild(viewMoreCommentsHTML);
  }
};

// Scroll Event Listener
let isScrolling = false;
document.addEventListener("scroll", async () => {
  if (isScrolling) {
    return;
  }
  isScrolling = true;
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/visitor"
  ) {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const clientHeight =
      (document.documentElement && document.documentElement.clientHeight) ||
      document.body.clientHeight;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const footer = document.getElementById("footer-section");

    if (
      scrollTop + clientHeight + 35 >= scrollHeight &&
      footer.classList.contains("d-none")
    ) {
      const container = document.getElementById("main-posts");
      const beforeLoadCount =
        container.querySelectorAll("#post-container").length;
      await loadPosts(container);
      const afterLoadCount =
        container.querySelectorAll("#post-container").length;
      if (afterLoadCount <= beforeLoadCount) {
        footer.classList.remove("d-none");
      }
    }
  }
  isScrolling = false;
});

const buttonLoadingOn = (button) => {
  if (!button) {return;}
    const buttonText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner-border');

    if (buttonText && spinner)  {
      button.disabled = true;
      buttonText.classList.add('d-none');
      spinner.classList.remove('d-none');
    }
};

const buttonLoadingOff = async (button, removeDisabled = true) => {
  if (!button) {return;}
  setTimeout(() => {
    const buttonText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner-border');

    if (buttonText && spinner)  {
      button.disabled = !removeDisabled;
      buttonText.classList.remove('d-none');
      spinner.classList.add('d-none');
    }
  }, 1);
};

document.addEventListener("click", async (event) => {
  if (!event.target.matches("button")) {
    return;
  }

  if (event.target.id === "signout-button") {
    try {
      await accountService.logout();
      window.location.replace("/login");
    } catch (error) {
      alert(error);
    }
  } else if (event.target.id === "home-button") {
    if (window.location.pathname === "/") {
      return;
    }

    window.location.replace("/");
  } else if (event.target.id === "create-post-button") {
    if (window.location.pathname === "/create-post") {
      return;
    }

    window.location.replace("/create-post");
  } else if (event.target.id === "settings-button") {
    if (window.location.pathname === "/settings") {
      return;
    }

    window.location.replace("/settings");
  } else if (event.target.id === "like-post") {
    const postId = event.target.getAttribute("post-id");
    const likeCountElement = document.querySelector(
      `[post-id="${postId}"]#like-count`
    );

    const iconTrue = event.target.querySelector("#like-true");
    const iconFalse = event.target.querySelector("#like-false");

    if (iconTrue.classList.contains("d-none")) {
      // Like
      await postService.like(postId);
      iconTrue.classList.remove("d-none");
      iconFalse.classList.add("d-none");
      likeCountElement.textContent = (
        parseInt(likeCountElement.textContent) + 1
      ).toString();
    } else {
      // Remove like
      await postService.dislike(postId);
      iconTrue.classList.add("d-none");
      iconFalse.classList.remove("d-none");
      likeCountElement.textContent = (
        parseInt(likeCountElement.textContent) - 1
      ).toString();
    }
  } else if (event.target.id === "more-comments-button") {
    event.target.disabled = true;
    const postId = event.target.getAttribute("post-id");
    await loadComments(postId);
  }
});

document.addEventListener("submit", async (event) => {
  if (!event.target.matches("form")) {
    return;
  }

  event.preventDefault();
  const submitButton = event.target.querySelector('button[type="submit"]');
  buttonLoadingOn(submitButton);
  let isFormValid = true;
  const formData = new FormData(event.target);
  const emailInput = document.getElementById("email");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const password2Input = document.getElementById("password2");
  const needSendEmailCheck = document.getElementById("needCommentSentCheck");

  //#region VALIDATION HELPERS
  // Show input error message
  function showError(input, message) {
    isFormValid = false;
    const formControl = input.parentElement;
    formControl.className = "form-outline form-white mb-3 error";
    input.placeholder = message;
  }

  // Show success outline
  function showSuccess(input) {
    //isFormValid = true;
    const formControl = input.parentElement;
    formControl.className = "form-outline form-white mb-3 success";
  }

  function checkRequired(inputArr) {
    inputArr.forEach((input) => {
      if (input.value.trim() === "") {
        showError(input, `${getFieldName(input)} is required`);
      } else {
        showSuccess(input);
      }
    });
  }

  // Check is mail is valid
  function checkEmail(input) {
    if (
      String(input.value)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      showSuccess(input);
    } else {
      showError(input, "Email is not valid");
    }
  }

  function checkLength(input, min, max) {
    if (input.value.length < min) {
      showError(
        input,
        `${getFieldName(input)} must be at least ${min} characters`
      );
    } else if (input.value.length > max) {
      showError(
        input,
        `${getFieldName(input)} must be less than ${max} characters`
      );
    } else {
      showSuccess(input);
    }
  }

  function checkPassword(input) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/;
    if (!passwordRegex.test(input.value)) {
      showError(
        input,
        "Password must include at least one uppercase, one lowecase and one number character."
      );
    }
    checkLength(input, 6, 32);
  }

  function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
      showError(input2, "Passwords not match");
    }
  }

  function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
  }
  //#endregion

  if (event.target.id === "login-form") {
    checkRequired([emailInput, passwordInput]);
    checkEmail(emailInput);
    if (!isFormValid) {
      buttonLoadingOff(submitButton);
      return;
    }

    try {
      await accountService.login(emailInput.value, passwordInput.value);
      window.location.replace("/");
      buttonLoadingOff(submitButton);
    } catch (error) {
      alert(error);
      buttonLoadingOff(submitButton);
    }
  } else if (event.target.id === "register-form") {
    checkRequired([usernameInput, emailInput, passwordInput, password2Input]);
    checkLength(usernameInput, 3, 15);
    checkEmail(emailInput);
    checkPassword(passwordInput);
    checkPassword(password2Input);
    checkPasswordsMatch(passwordInput, password2Input);
    if (!isFormValid) {
      buttonLoadingOff(submitButton);
      return;
    }

    try {
      await accountService.register({
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        confirmpassword: password2Input.value,
      });

      localStorage.setItem("verification-sent", "true");
      alert(
        "Verification Link Sent! Please verify your account using the link that has been sent to your email"
      );
      buttonLoadingOff(submitButton);
    } catch (error) {
      alert(error);
      buttonLoadingOff(submitButton);
    }
  } else if (event.target.id === "forgot-password-form") {
    checkRequired([emailInput]);
    checkEmail(emailInput);
    if (!isFormValid) {
      buttonLoadingOff(submitButton);
      return;
    }

    try {
      await accountService.forgotPassword(emailInput.value);
      localStorage.setItem("reset-password-sent", "true");
      alert("Email instructions sent successfully!", 3000);
      buttonLoadingOff(submitButton);
    } catch (error) {
      alert(error);
      buttonLoadingOff(submitButton);
    }
  } else if (event.target.id === "reset-password-form") {
    checkRequired([passwordInput, password2Input]);
    checkPassword(passwordInput);
    checkPassword(password2Input);
    checkPasswordsMatch(passwordInput, password2Input);
    if (!isFormValid) {
      buttonLoadingOff(submitButton);
      return;
    }

    try {
      const resetToken = localStorage.getItem("reset-token");
      await accountService.resetPassword({
        token: resetToken,
        password: passwordInput.value,
        confirmPassword: password2Input.value,
      });
      localStorage.removeItem("reset-password-sent");
      localStorage.removeItem("reset-token");
      alert("Password reseted successfully, now you can LogIn!", 3000);
      setTimeout(() => {
        window.location.replace("/login");
      }, 3000);
      buttonLoadingOff(submitButton);
    } catch (error) {
      alert(error);
      buttonLoadingOff(submitButton);
    }
  } else if (event.target.id === "settings-form") {
    let reloginRequired = false;

    if (emailInput.value !== "") {
      checkEmail(emailInput);
      reloginRequired = true;
    }
    if (passwordInput.value !== "") {
      checkPassword(passwordInput);
      checkPassword(password2Input);
      checkPasswordsMatch(passwordInput, password2Input);
    }
    if (usernameInput.value !== "") {
      checkLength(usernameInput, 3, 15);
    }
    if (!isFormValid) {
      buttonLoadingOff(submitButton);
      return;
    }

    try {
      await accountService.update({
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        confirmPassword: password2Input.value,
        needSendNotifications: needSendEmailCheck.checked,
      });

      if (reloginRequired) {
        alert(
          "Profile updated successfully, now you need approve your email. See you :)",
          3000
        );
        setTimeout(async () => {
          await accountService.logout();
          localStorage.setItem("verification-sent", "true");
          window.location.replace("/verification-sent");
        }, 3000);
      } else {
        alert("Profile updated successfully!", 3000);
        setTimeout(() => {
          window.location.replace("/");
        }, 3000);
      }
      buttonLoadingOff(submitButton);
    } catch (error) {
      alert(error);
      buttonLoadingOff(submitButton);
    }
  } else if (event.target.id === "comment-form") {
    const commentInput = event.target.querySelector("#input-comment");
    if (commentInput.value === "") {
      return;
    }

    const postId = event.target.getAttribute("post-id");
    const comment = commentInput.value;
    event.target.reset();

    const commentResponse = await postService.createCommentary(postId, comment);

    const commentContainer = document.querySelector(
      `[post-id="${postId}"]#comment-container`
    );

    const lastElement = commentContainer.lastElementChild;
    const newElement = convertStringToElement(
      await (await fetch(`html/mains/comment.html`)).text()
    );
    const usernameElement = newElement.querySelector("#comment-username");
    const contentElement = newElement.querySelector("#comment-content");
    const dateElement = newElement.querySelector("#comment-created-date");

    newElement.setAttribute("comment-id", commentResponse.commentId);
    usernameElement.textContent = `${commentResponse.username}:`;
    contentElement.textContent = comment;
    dateElement.textContent = determineDate(commentResponse.createDate);

    if (lastElement === null || lastElement.id != "view-more-comments") {
      commentContainer.appendChild(newElement);
    } else {
      commentContainer.insertBefore(newElement, lastElement);
    }

    const postContainer = document.querySelector(
      `[post-id="${postId}"]#post-container`
    );

    const divider = postContainer.querySelector("#divider");
    const likedText = postContainer.querySelector("#liked-count-text");
    divider.classList.remove("d-none");
    likedText.classList.add("mb-2");
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.matches("a")) {
    return;
  }
  e.preventDefault();
  urlRoute(e);
});

const urlRoutes = {
  "/403": {
    name: "/403",
    title: "Camagru | Forbidden",
    headerLink: "",
    mainLink: "403.html",
    footerLink: "footer.html",
  },
  "/404": {
    name: "/404",
    title: "Camagru | Not found",
    headerLink: "",
    mainLink: "404.html",
    footerLink: "footer.html",
  },
  "/visitor": {
    name: "/visitor",
    title: "Camagru",
    headerLink: "visitor.html",
    mainLink: "visitor.html",
    footerLink: "footer.html",
  },
  "/login": {
    name: "/login",
    title: "Camagru",
    headerLink: "login.html",
    mainLink: "login.html",
    footerLink: "footer.html",
  },
  "/register": {
    name: "/register",
    title: "Camagru | Register",
    headerLink: "register.html",
    mainLink: "register.html",
    footerLink: "footer.html",
  },
  "/": {
    name: "/",
    title: "Camagru",
    headerLink: "home.html",
    mainLink: "home.html",
    footerLink: "footer.html",
    navbarLink: "navbar.html",
  },
  "/verification-sent": {
    name: "/verification-sent",
    title: "Camagru | Verify",
    headerLink: "",
    mainLink: "verification-sent.html",
    footerLink: "",
  },
  "/verify-email": {
    name: "/verify-email",
    title: "Camagru | Verify",
    headerLink: "register.html",
    mainLink: "email-verified.html",
    footerLink: "",
  },
  "/forgot-password": {
    name: "/forgot-password",
    title: "Camagru | Forgot",
    headerLink: "register.html",
    mainLink: "forgot-password.html",
    footerLink: "",
  },
  "/reset-password": {
    name: "/reset-password",
    title: "Camagru | Reset",
    headerLink: "",
    mainLink: "reset-password.html",
    footerLink: "",
  },
  "/create-post": {
    name: "/create-post",
    title: "Camagru | New Post",
    headerLink: "home.html",
    mainLink: "create-post.html",
    footerLink: "",
  },
  "/settings": {
    name: "/settings",
    title: "Camagru | Settings",
    headerLink: "home.html",
    mainLink: "settings.html",
    footerLink: "",
  },
};

const afterPageLoad = async (location) => {
  //HEADER
  //FOOTER
  const footer = document.getElementById('footer-section');
  footer.classList.add('d-none');
  footer.classList.remove('fixed-bottom');
  //MAINS
  if (location === "/" || location === "/visitor") {
    const mainSection = document.getElementById("main-section");
    mainSection.classList.remove("d-flex", "flex-grow-1", "align-items-center");
  } else {
    const mainSection = document.getElementById("main-section");
    mainSection.classList.add("d-flex", "flex-grow-1", "align-items-center");
  }

  if (location === "/" || location === "/visitor") {
    const container = document.getElementById("main-posts");
    await loadPosts(container, null, true);
    const post = document.getElementById("post-container");
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;

    if (!post) {
      const mainSection = document.getElementById("main-section");
      mainSection.classList.add("d-flex", "flex-grow-1", "align-items-center");
      const looksEmptyElement = convertStringToElement(
        await (await fetch(`html/mains/looks-empty.html`)).text()
      );
      container.appendChild(looksEmptyElement);
      const footer = document.getElementById("footer-section");
      footer.classList.remove("d-none");
    } else if (scrollTop + window.innerHeight >= scrollHeight) {
      const footer = document.getElementById("footer-section");
      footer.classList.remove("d-none");
      footer.classList.add("fixed-bottom");
    }
    stopWebcam();
  } else if (location === "/create-post") {
    const stickerNames = await postService.getStickersName();
    const verticalStickerContainer =
      document.getElementById("sticker-container");
    const horizontalStickerContainer = document.getElementById(
      "sticker-container-horizontal"
    );
    const verticalStickerElement = convertStringToElement(
      await (await fetch(`html/mains/vertical-sticker.html`)).text()
    );
    const horizontalStickerElement = convertStringToElement(
      await (await fetch(`html/mains/horizontal-sticker.html`)).text()
    );
    for (let i = 0; i < stickerNames.length; i++) {
      const newVertical = verticalStickerElement.cloneNode(true);
      const newHorizontal = horizontalStickerElement.cloneNode(true);
      const verticalImage = newVertical.querySelector(".sticker");
      const horizontalImage = newHorizontal.querySelector(".sticker");
      verticalImage.src = `/media/stickers/${stickerNames[i]}`;
      horizontalImage.src = `/media/stickers/${stickerNames[i]}`;
      // Vertical
      if (i % 2 === 0) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.appendChild(newVertical);
        verticalStickerContainer.appendChild(row);
      } else {
        const allRows = verticalStickerContainer.querySelectorAll(".row");
        const lastRow = allRows[allRows.length - 1];
        lastRow.appendChild(newVertical);
      }
      // Horizontal
      const row = horizontalStickerContainer.querySelector(".row");
      row.appendChild(newHorizontal);
    }
    await setCreatePost();
  } else if (location === "/verify-email") {
    const token = localStorage.getItem("verification-token");

    try {
      await accountService.verifyEmail(token);
      localStorage.removeItem("verification-token");
      localStorage.removeItem("verification-sent");
      const header = document.getElementById("verify-header");
      header.textContent = "Email verified successfully, you can login now!";
    } catch (error) {
      window.location.replace("/403");
    }
  } else if (location === "/settings") {
    let currUser;
    const item = localStorage.getItem("currentUser");
    if (item && item !== "undefined") {
      currUser = JSON.parse(item);
    }
    const checkbox = document.getElementById("needCommentSentCheck");
    checkbox.checked = currUser.needSendNotifications;
  }

  // GENERAL
  const buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const icons = button.getElementsByTagName("svg");
    const smalls = button.getElementsByTagName("small");
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      icon.style.pointerEvents = "none";
    }
    for (let i = 0; i < smalls.length; i++) {
      const small = smalls[i];
      small.style.pointerEvents = "none";
    }
  }
};

const urlRoute = (event) => {
  event.preventDefault();
  const absoluteURL = event.target.href;
  let relativePath;

  if (absoluteURL.length <= 0) {
    relativePath = "blank";
  } else {
    const url = new URL(absoluteURL);
    relativePath = url.pathname.length > 0 ? url.pathname : "/";
  }

  if (relativePath === window.location.pathname) {
    window.location.replace(window.location.pathname);
  } else if (relativePath === "/create-post") {
    window.location.replace("/create-post");
  } else {
    urlLocationHandler(relativePath);
  }
};

const urlLocationHandler = async (pathname) => {
  let location;
  if (typeof pathname != "object") {
    location = pathname || window.location.pathname;
  } else {
    location = window.location.pathname;
  }

  let route = urlRoutes[location] || urlRoutes["/404"];
  route = await changeRoute(route);

  location = route.name;
  if (route.headerLink !== "") {
    const headerElement = await (
      await fetch(`html/headers/${route.headerLink}`)
    ).text();
    document.getElementById("header-section").innerHTML = headerElement;
  }
  if (route.mainLink !== "") {
    const mainElement = await (
      await fetch(`html/mains/${route.mainLink}`)
    ).text();
    document.getElementById("main-section").innerHTML = mainElement;
  }
  if (route.footerLink !== "") {
    const footerElement = await (
      await fetch(`html/footers/${route.footerLink}`)
    ).text();
    document.getElementById("footer-section").innerHTML = footerElement;
  }

  if (pathname !== undefined) {
    window.history.replaceState({}, "", window.location.pathname);
  }

  afterPageLoad(location);

  if (typeof pathname != "object") {
    window.history.pushState({}, "", location);
  }
};

const changeRoute = async (route) => {
  accountService.refreshToken();
  let currUser;
  const item = localStorage.getItem("currentUser");
  if (item && item !== "undefined") {
    currUser = JSON.parse(item);
  }

  if (route.name === "/" || route.name === "/visitor") {
    route = currUser ? urlRoutes["/"] : urlRoutes["/visitor"];
  } else if (route.name === "/login") {
    route = currUser ? urlRoutes["/"] : urlRoutes["/login"];
  } else if (route.name === "/register") {
    route = currUser ? urlRoutes["/"] : urlRoutes["/register"];
  } else if (route.name === "/forgot-password") {
    route = currUser ? urlRoutes["/"] : urlRoutes["/forgot-password"];
  } else if (route.name === "/create-post") {
    route = currUser ? urlRoutes["/create-post"] : urlRoutes["/visitor"];
  } else if (route.name === "/settings") {
    route = currUser ? urlRoutes["/settings"] : urlRoutes["/visitor"];
  } else if (route.name === "/verification-sent") {
    const isVerificationSent = localStorage.getItem("verification-sent");
    route =
      isVerificationSent === "true"
        ? urlRoutes["/verification-sent"]
        : urlRoutes["/visitor"];
  } else if (route.name === "/verify-email") {
    const isVerificationSent = localStorage.getItem("verification-sent");
    if (isVerificationSent) {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");
      localStorage.setItem("verification-token", token);
      route = urlRoutes["/verify-email"];
    } else {
      route = urlRoutes["/403"];
    }
  } else if (route.name === "/reset-password") {
    const isResetSent = localStorage.getItem("reset-password-sent");
    if (isResetSent) {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");
      localStorage.setItem("reset-token", token);
      route = urlRoutes["/reset-password"];
    } else {
      route = urlRoutes["/403"];
    }
  }

  return route;
};

window.onpopstate = urlLocationHandler;
window.addEventListener("popstate", urlRoute);

urlLocationHandler();
