document.addEventListener("DOMContentLoaded", function () {
    const toggleFormButton = document.querySelector(".toggle-form-button");
    const formContainer = document.querySelector(".form-container");
    const form = document.getElementById("emergencyForm");
    const submitBtn = document.getElementById("submitBtn");
    const clearBtn = document.getElementById("clearBtn");
    const incidentTypeSelect = document.getElementById("incidentType");
    const rescueDetails = document.getElementById("rescueDetails");
    const peopleCountInput = document.getElementById("peopleCount");
    const unknownPeopleCheckbox = document.getElementById("unknownPeople");
    const openMapBtn = document.getElementById("openMapBtn"); // Google Mapsボタンの要素を取得


    // ページ読み込み時にフォームのデータをlocalStorageから復元
    loadFormData();
    loadPosts();

    // フォームの表示/非表示を切り替え
    toggleFormButton.addEventListener("click", function () {
        if (formContainer.style.display === "none" || formContainer.style.display === "") {
            formContainer.style.display = "block";
        } else {
            formContainer.style.display = "none";
        }
    });

    // フォーム送信時の処理
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        // 必須条件の検証
        const incidentType = incidentTypeSelect.value;
        const peopleCount = peopleCountInput.value;
        const unknownPeopleChecked = unknownPeopleCheckbox.checked;
        
        if (incidentType === "要救助者あり" && !(peopleCount || unknownPeopleChecked)) {
             alert("人数欄または「人数不明・複数人」にチェックをつけてください。");
             return;
        }

        const postData = await getFormData();  // 非同期でフォームデータを取得
        addPostToTable(postData);
        savePosts();
        form.reset();
        submitBtn.disabled = true;
        submitBtn.classList.add("disabled");
        formContainer.style.display = "none";  // フォームを非表示に戻す
    });

    // フォームデータを取得してオブジェクトとして返す（非同期処理）
    async function getFormData() {
        const photoFile = document.getElementById("photo").files[0];
        let photoBase64 = null;

        if (photoFile) {
            photoBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(photoFile);
            });
        }

        return {
            date: new Date().toLocaleString(),
            katakanaName: document.getElementById("katakanaName").value,
            kanjiName: document.getElementById("kanjiName").value,
            organization: document.getElementById("organization").value,
            incidentType: document.getElementById("incidentType").value,
            area: document.getElementById("area").value,
            address: document.getElementById("address").value,
            mapLink: document.getElementById("mapLink").value,
            photo: photoBase64,
            memo: document.getElementById("memo").value,
            numberOfPeople: unknownPeopleCheckbox.checked ? "不明・複数人" : document.getElementById("peopleCount").value // 人数を追加
        };
    }

    // 投稿をテーブルに追加
    function addPostToTable(post) {
        const tableBody = document.querySelector("#postsTable tbody");
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = post.date;
        row.appendChild(dateCell);

        const katakanaNameCell = document.createElement("td");
        katakanaNameCell.textContent = post.katakanaName;
        row.appendChild(katakanaNameCell);

        const kanjiNameCell = document.createElement("td");
        kanjiNameCell.textContent = post.kanjiName;
        row.appendChild(kanjiNameCell);

        const organizationCell = document.createElement("td");
        organizationCell.textContent = post.organization;
        row.appendChild(organizationCell);

        const incidentTypeCell = document.createElement("td");
        incidentTypeCell.textContent = post.incidentType;
        row.appendChild(incidentTypeCell);

        const areaCell = document.createElement("td");
        areaCell.textContent = post.area;
        row.appendChild(areaCell);

        const addressCell = document.createElement("td");
        addressCell.textContent = post.address;
        row.appendChild(addressCell);

        const mapLinkCell = document.createElement("td");
        if (post.mapLink) {
            const mapLinkElement = document.createElement("a");
            mapLinkElement.href = post.mapLink;
            mapLinkElement.textContent = "地図リンク";
            mapLinkElement.target = "_blank";
            mapLinkCell.appendChild(mapLinkElement);
        }
        row.appendChild(mapLinkCell);

        const photoCell = document.createElement("td");
        if (post.photo) {
            const img = document.createElement("img");
            img.src = post.photo;
            img.alt = "写真";
            photoCell.appendChild(img);
        }
        row.appendChild(photoCell);

        const memoCell = document.createElement("td");
        memoCell.textContent = post.memo;
        row.appendChild(memoCell);

        const numberOfPeopleCell = document.createElement("td"); // 人数セルを追加
        numberOfPeopleCell.textContent = post.numberOfPeople;
        row.appendChild(numberOfPeopleCell);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.addEventListener("click", function () {
            row.remove();
            savePosts();
        });
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    }

    // ローカルストレージに保存されている投稿をテーブルに読み込み
    function loadPosts() {
        const savedPosts = localStorage.getItem("emergencyPosts");
        if (savedPosts) {
            const posts = JSON.parse(savedPosts);
            posts.forEach(post => addPostToTable(post));
        }
    }

    // フォームのデータをローカルストレージに保存
    function savePosts() {
        const tableBody = document.querySelector("#postsTable tbody");
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        const posts = rows.map(row => {
            const cells = row.querySelectorAll("td");
            return {
                date: cells[0].textContent,
                katakanaName: cells[1].textContent,
                kanjiName: cells[2].textContent,
                organization: cells[3].textContent,
                incidentType: cells[4].textContent,
                area: cells[5].textContent,
                address: cells[6].textContent,
                mapLink: cells[7].querySelector("a")?.href,
                photo: cells[8].querySelector("img")?.src,
                memo: cells[9].textContent,
                numberOfPeople: cells[10].textContent // 人数を保存
            };
        });
        localStorage.setItem("emergencyPosts", JSON.stringify(posts));
    }

    // フォームのデータをローカルストレージに保存する関数
    function saveFormData() {
        const formData = getFormData();
        localStorage.setItem("emergencyFormData", JSON.stringify(formData));
    }

    // ローカルストレージからフォームのデータを読み込む関数
    function loadFormData() {
        const savedFormData = localStorage.getItem("emergencyFormData");
        if (savedFormData) {
            const formData = JSON.parse(savedFormData);
            document.getElementById("katakanaName").value = formData.katakanaName || "";
            document.getElementById("kanjiName").value = formData.kanjiName || "";
            document.getElementById("organization").value = formData.organization || "";
            document.getElementById("incidentType").value = formData.incidentType || "";
            document.getElementById("area").value = formData.area || "";
            document.getElementById("address").value = formData.address || "";
            document.getElementById("mapLink").value = formData.mapLink || "";
            document.getElementById("memo").value = formData.memo || "";
            document.getElementById("peopleCount").value = formData.numberOfPeople || ""; // 人数を復元
        }
    }

    // クリアボタンのクリック時の処理
    clearBtn.addEventListener("click", function () {
        form.reset();
        localStorage.removeItem("emergencyFormData");
        submitBtn.disabled = true;
        submitBtn.classList.add("disabled");
    });

    // ローカルストレージから投稿データを削除する関数
    function clearPosts() {
        localStorage.removeItem("emergencyPosts");
        const tableBody = document.querySelector("#postsTable tbody");
        tableBody.innerHTML = "";
    }

    // 「要救助者あり」を選択した際に人数欄を表示する処理
    incidentTypeSelect.addEventListener("change", function () {
        if (incidentTypeSelect.value === "要救助者あり") {
            rescueDetails.style.display = "block";
        } else {
            rescueDetails.style.display = "none";
        }
    });

    // 人数不明チェックボックスが変更されたときの処理
    unknownPeopleCheckbox.addEventListener("change", function () {
        if (unknownPeopleCheckbox.checked) {
            peopleCountInput.disabled = true;
            peopleCountInput.style.backgroundColor = "#d3d3d3"; // グレーアウト
        } else {
            peopleCountInput.disabled = false;
            peopleCountInput.style.backgroundColor = ""; // 元の背景色に戻す
        }
    });

        // Google Mapsを開くボタンのクリックイベント
        openMapBtn.addEventListener("click", function () {
            const area = document.getElementById("area").value;
            const address = document.getElementById("address").value;
            const fullAddress = `静岡県下田市 ${area} ${address}`;
            const encodedAddress = encodeURIComponent(fullAddress);
            const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            window.open(googleMapsURL, '_blank'); // 新しいタブで開く
        });

    // フォームの入力内容に応じてボタンの状態を更新する関数
function updateSubmitButtonState() {
    const incidentType = incidentTypeSelect.value;
    const peopleCount = peopleCountInput.value;
    const unknownPeopleChecked = unknownPeopleCheckbox.checked;
    
    // 「事態種別」が「要救助者あり」で、人数欄または「人数不明・複数人」にチェックがない場合、ボタンを無効にする
    if (incidentType === "要救助者あり" && !(peopleCount || unknownPeopleChecked)) {
        submitBtn.disabled = true;
        submitBtn.classList.add("disabled");
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove("disabled");
    }
}

// フォーム要素の変更イベントにリスナーを追加してボタンの状態を更新
incidentTypeSelect.addEventListener("change", updateSubmitButtonState);
peopleCountInput.addEventListener("input", updateSubmitButtonState);
unknownPeopleCheckbox.addEventListener("change", updateSubmitButtonState);
});
