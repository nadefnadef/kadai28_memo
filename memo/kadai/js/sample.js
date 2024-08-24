const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("emergencyForm");
const clearBtn = document.getElementById("clearBtn");
const toggleFormButton = document.querySelector(".toggle-form-button");
const formContainer = document.querySelector(".form-container");
const incidentType = document.getElementById("incidentType");
const rescueDetails = document.getElementById("rescueDetails");
const peopleCount = document.getElementById("peopleCount");
const unknownPeople = document.getElementById("unknownPeople");

// フォームの表示/非表示を切り替え
toggleFormButton.addEventListener("click", () => {
    const isFormVisible = formContainer.style.display === "block";
    formContainer.style.display = isFormVisible ? "none" : "block";
    toggleFormButton.textContent = isFormVisible ? "新規被害について投稿する" : "投稿をキャンセル";
});

// 入力内容を確認して、送信ボタンを有効化
form.addEventListener("input", () => {
    let isValid = form.checkValidity();
    submitBtn.disabled = !isValid;
    submitBtn.classList.toggle("disabled", !isValid);
});

// "要救助者あり"が選択された場合、追加の入力項目を表示
incidentType.addEventListener("change", () => {
    if (incidentType.value === "要救助者あり") {
        rescueDetails.style.display = "block";
        peopleCount.required = true;
    } else {
        rescueDetails.style.display = "none";
        peopleCount.required = false;
    }
});

// 人数不明チェックボックスが選択された場合、人数入力を無効化
unknownPeople.addEventListener("change", () => {
    peopleCount.disabled = unknownPeople.checked;
    if (unknownPeople.checked) {
        peopleCount.value = "";
    }
});

// フォーム送信時にデータをテーブルに追加
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const postsTable = document.getElementById("postsTable").getElementsByTagName('tbody')[0];
    const newRow = postsTable.insertRow();

    // 各入力値を取得
    const katakanaName = document.getElementById("katakanaName").value;
    const kanjiName = document.getElementById("kanjiName").value;
    const organization = document.getElementById("organization").value;
    const incidentTypeValue = incidentType.value;
    const area = document.getElementById("area").value;
    const address = document.getElementById("address").value || "なし";
    const mapLink = document.getElementById("mapLink").value;
    const memo = document.getElementById("memo").value || "なし";
    const photo = document.getElementById("photo").files[0];

    const now = new Date();
    const datetime = now.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Google Mapsリンクから緯度・経度を抽出
    const regex = /@([-.\d]+),([-.\d]+)/;
    const match = mapLink.match(regex);
    let latLon = "不明";
    if (match) {
        const lat = match[1];
        const lon = match[2];
        latLon = `${lat}, ${lon}`;
    }

    // 新しい行にデータを追加
    newRow.innerHTML = `
        <td>${datetime}</td>
        <td>${katakanaName}</td>
        <td>${kanjiName}</td>
        <td>${organization}</td>
        <td>${incidentTypeValue}</td>
        <td>${area}</td>
        <td>${address}</td>
        <td><a href="${mapLink}" target="_blank">${latLon}</a></td>
        <td>${photo ? '<img src="' + URL.createObjectURL(photo) + '" alt="現場写真">' : 'なし'}</td>
        <td class="tooltip">${memo.split('').map((char, index) => (index % 10 === 9 ? char + "<br>" : char)).join('')}<span class="tooltiptext">${memo}</span></td>
    `;

    // フォームをリセット
    form.reset();
    formContainer.style.display = "none";
    submitBtn.disabled = true;
    submitBtn.classList.add("disabled");
    toggleFormButton.textContent = "新規被害について投稿する";
});

// 消去ボタンの動作
clearBtn.addEventListener("click", () => {
    if (confirm("フォームを消去しますか？")) {
        form.reset();
        rescueDetails.style.display = "none";
        submitBtn.disabled = true;
        submitBtn.classList.add("disabled");
    }
});
