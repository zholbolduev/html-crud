// -------------------------НАШ API , ВЗЯЛИ ИЗ ТЕРМИНАЛА , КОГДА ЗАПУСТИЛИ JSON-SERVER-------------
let API = "http://localhost:8000/posts";

// -------------------------ИСПОЛЬЗУЯ DOM ВЫТАЩИЛИ ТЕГИ ИЗ HTML
let inputLike = document.querySelector(".inputLike");
let inputComment = document.querySelector(".inputComment");
let inputView = document.querySelector(".inputView");
let inputImage = document.querySelector(".inputImage");
let addPostButton = document.querySelector(".addPost");

// ------------------------------------FUNCTION ADD POST--------------------
async function addPostFunc() {
  //-------------------ЗНАЧЕНИЕ ИНПУТОВ----------------------------------
  let inputValue = {
    like: inputLike.value,
    comment: inputComment.value,
    view: inputView.value,
    image: inputImage.value,
  };

  //   --------------------ПРОВЕРЯЕМ НА ЗАПОЛНЕНИЕ, ЕСЛИ НЕТ СБЩ ОТПРАВЛЯЕМ------------------------
  if (
    !inputValue.like ||
    !inputValue.comment ||
    !inputValue.view ||
    !inputValue.image
  ) {
    alert("заполните все поля");
    return;
  }

  //   ---------------------------УСТАНОВЛИВАЕМ В JSON-SERVER----------------
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(inputValue),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));

  // ------------------------------ОТОБРАЖАЕМ В СТРАНИЦУ---------------------
  list();

  //   ------------------ОЧИЩАЕМ ИНПУТОВ ПОСЛЕ НАЖАТИЕ ADD POST--------------------------
  inputLike.value = "";
  inputComment.value = "";
  inputView.value = "";
  inputImage.value = "";
}

// -------------------НАВЕЩИВАЕМ СОБЫТИЕ(ФУНКЦИЮ) НА КНОПКУ ADD POST---------------------
addPostButton.addEventListener("click", () => {
  addPostFunc();
});

let postList = document.querySelector(".list");
let ul = document.createElement("ul");
postList.appendChild(ul);

// ----------------------------VIEW FUNCTION---------------------------------------
function list() {
  fetch(API)
    .then((response) => response.json())
    .then((data) => {
      let dataArray = Array.isArray(data) ? data : [data];

      dataArray.forEach((item) => {
        let li = document.createElement("li");
        li.setAttribute("data-id", item.id); // добавить data-id к li элементу
        li.innerHTML = `
        <p>${item.like}</p>
        <p>${item.comment}</p>
        <p>${item.view}</p>
        <img src="${item.image}" />`;

        let editPost = document.createElement("button");
        editPost.textContent = "Edit";
        editPost.addEventListener("click", () => {
          editX(item.id);
        });

        let deletePost = document.createElement("button");
        deletePost.textContent = "X";
        deletePost.setAttribute("data-id", item.id); // добавить data-id к кнопке

        deletePost.addEventListener("click", () => {
          deleteX(item.id);
        });

        ul.appendChild(li);
        li.appendChild(editPost);
        li.appendChild(deletePost);
      });
    });
}

//   --------------------------------DELETE FUNCTION------------------------------------
async function deleteX(postId) {
  await fetch(`${API}/${postId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      let deletedPost = document.querySelector(`li[data-id="${postId}"]`);
      deletedPost.parentNode.removeChild(deletedPost);
    })
    .catch((error) => console.log(error));
}

// --------------------------------EDIT FUNCTION ---------------------------------
async function editX(postId) {
  let post = await fetch(`${API}/${postId}`).then((response) =>
    response.json()
  );

  let form = document.createElement("form");
  form.innerHTML = `
      <input type="text" name="like" value="${post.like}">
      <input type="text" name="comment" value="${post.comment}">
      <input type="text" name="view" value="${post.view}">
      <input type="text" name="image" value="${post.image}">
      <button type="submit">Save</button>
    `;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    let editedPost = {};
    for (let [key, value] of formData.entries()) {
      editedPost[key] = value;
    }

    await fetch(`${API}/${postId}`, {
      method: "PUT",
      body: JSON.stringify(editedPost),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        form.parentNode.innerHTML = `
            <p>${editedPost.like}</p>
            <p>${editedPost.comment}</p>
            <p>${editedPost.view}</p>
            <img src="${editedPost.image}" />
          `;
      })
      .catch((error) => console.log(error));
  });

  let li = document.querySelector(`li[data-id="${postId}"]`);
  li.innerHTML = "";
  li.appendChild(form);
}

//-------------------------RENDER----------------------------------
list();
