document.addEventListener("DOMContentLoaded", function () {
    const toggleFormButton = document.querySelector(".toggle-form-button");
    const formContainer = document.querySelector(".form-container");
    const form = document.getElementById("emergencyForm");
    const submitBtn = document.getElementById("submitBtn");
    const clearBtn = document.getElementById("clearBtn");
    const incidentType = document.getElementById("incidentType");
    const openMapBtn = document.getElementById("openMapBtn");
    const mapLinkInput = document.getElementById("mapLink");
    let selectedLocation = null;

    // ページ読み込み時にフォームのデータをlocalStorageから復元
    loadFormData();
    loadPosts();

    // フォームの表示/非表示を切り替え
    toggleFormButton.addEventListener("click", function () {
        if (formContainer.style.display === "none") {
            formContainer.style.display = "block";
        } else {
            formContainer.style.display = "none";
        }
    });

    // フォーム送信時の処理
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const postData = getFormData();
        addPostToTable(postData);
        savePosts();
        form.reset();
        submitBtn.disabled = true;
        submitBtn.classList.add("disabled");
        toggleFormButton.click();  // フォームを非表示に戻す
    });

    // フォームの入力が完了したら投稿ボタンを有効化
    form.addEventListener("input", function () {
        submitBtn.disabled = !form.checkValidity();
        if (!submitBtn.disabled) {
            submitBtn.classList.remove("disabled");
        } else {
            submitBtn.classList.add("disabled");
        }
    });

    // フォームデータを取得してオブジェクトとして返す
    function getFormData() {
        return {
            date: new Date().toLocaleString(),
            katakanaName: document.getElementById("katakanaName").value,
            kanjiName: document.getElementById("kanjiName").value,
            organization: document.getElementById("organization").value,
            incidentType: document.getElementById("incidentType").value,
            area: document.getElementById("area").value,
            address: document.getElementById("address").value,
            mapLink: document.getElementById("mapLink").value,
            photo: document.getElementById("photo").files[0],
            memo: document.getElementById("memo").value
        };
    }

    // Google Map ボタンのクリック時に新しいタブでGoogle Mapを開く
    openMapBtn.addEventListener("click", function () {
        const area = document.getElementById("area").value;
        const address = document.getElementById("address").value;
        
        // 発生場所と住所（つづき）を結合してGoogle Mapで検索
        const searchQuery = `${area} ${address}`;
        const googleMapUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(searchQuery)}`;
        
        // Google Mapを別タブで開く
        window.open(googleMapUrl, '_blank');
    });

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
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = "写真";
                photoCell.appendChild(img);
            };
            reader.readAsDataURL(post.photo);
        }
        row.appendChild(photoCell);

        const memoCell = document.createElement("td");
        memoCell.textContent = post.memo;
        row.appendChild(memoCell);

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
                memo: cells[9].textContent
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
});
