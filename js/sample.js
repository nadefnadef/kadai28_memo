document.addEventListener("DOMContentLoaded", function () {
    const toggleFormButton = document.querySelector(".toggle-form-button");
    const formContainer = document.querySelector(".form-container");
    const form = document.getElementById("emergencyForm");
    const submitBtn = document.getElementById("submitBtn");
    const clearBtn = document.getElementById("clearBtn");
    const incidentType = document.getElementById("incidentType");
    const rescueDetails = document.getElementById("rescueDetails");
    const peopleCount = document.getElementById("peopleCount");
    const unknownPeople = document.getElementById("unknownPeople");
    const openMapBtn = document.getElementById("openMapBtn");
    const mapModal = document.getElementById("mapModal");
    const closeBtn = document.querySelector(".close");
    const mapLinkInput = document.getElementById("mapLink");
    const addressInput = document.getElementById("address");
    let selectedLocation = null;

    // ページ読み込み時にフォームのデータをlocalStorageから復元
    loadFormData();

    // フォームの表示・非表示の切り替え
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
        saveFormData(); // 入力があるたびにフォームデータを保存
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
        saveFormData(); // 選択に応じてフォームデータを保存
    });

    // 人数不明チェックボックスが選択された場合、人数入力を無効化
    unknownPeople.addEventListener("change", () => {
        peopleCount.disabled = unknownPeople.checked;
        if (unknownPeople.checked) {
            peopleCount.value = "";
        }
        saveFormData(); // チェックボックスの選択に応じてフォームデータを保存
    });

    // Google Mapsの表示
    openMapBtn.addEventListener("click", () => {
        mapModal.style.display = "block";
        initMap();
    });

    // モーダルを閉じる
    closeBtn.addEventListener("click", () => {
        mapModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === mapModal) {
            mapModal.style.display = "none";
        }
    });

    // Google Mapsの初期化
    function initMap() {
        const mapOptions = {
            center: { lat: 35.6895, lng: 139.6917 }, // 東京をデフォルトの中心とする
            zoom: 12
        };

        const map = new google.maps.Map(document.getElementById("map"), mapOptions);
        const geocoder = new google.maps.Geocoder();

        // 地図上で右クリックした位置の情報を取得
        map.addListener("rightclick", function (event) {
            selectedLocation = event.latLng;
            const mapLink = `https://www.google.com/maps/@${selectedLocation.lat()},${selectedLocation.lng()},15z`;
            
            // 逆ジオコーディングで住所を取得
            geocoder.geocode({ location: selectedLocation }, (results, status) => {
                if (status === "OK" && results[0]) {
                    addressInput.value = results[0].formatted_address || "不明";
                    // Google Mapsリンクを自動入力するかどうかをオプションに
                    if (confirm("この場所のリンクをフォームにコピーしますか？")) {
                        mapLinkInput.value = mapLink;
                    }
                    saveFormData(); // 地図での選択後にフォームデータを保存
                    mapModal.style.display = "none";
                } else {
                    alert("住所を取得できませんでした");
                }
            });
        });
    }

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
            <td>${mapLink ? `<a href="${mapLink}" target="_blank">${latLon}</a>` : 'なし'}</td>
            <td>${photo ? '<img src="' + URL.createObjectURL(photo) + '" alt="現場写真">' : 'なし'}</td>
            <td class="tooltip">${memo.split('').map((char, index) => (index % 10 === 9 ? char + "<br>" : char)).join('')}<span class="tooltiptext">${memo}</span></td>
            <td><button class="deleteBtn">削除</button></td>
        `;

        // フォームをリセットし、localStorageのデータもクリア
        form.reset();
        localStorage.removeItem('formData');
        formContainer.style.display = "none";
        submitBtn.disabled = true;
        submitBtn.classList.add("disabled");
        toggleFormButton.textContent = "新規被害について投稿する";

        // 削除ボタンのイベントリスナーを追加
        const deleteBtn = newRow.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click", () => {
            if (confirm("この投稿を削除しますか？")) {
                newRow.remove();
            }
        });
    });

    // 消去ボタンの動作
    clearBtn.addEventListener("click", () => {
        if (confirm("フォームを消去しますか？")) {
            form.reset();
            localStorage.removeItem('formData');
            rescueDetails.style.display = "none";
            submitBtn.disabled = true;
            submitBtn.classList.add("disabled");
        }
    });

    // フォームデータをlocalStorageに保存する関数
    function saveFormData() {
        const formData = {
            katakanaName: document.getElementById("katakanaName").value,
            kanjiName: document.getElementById("kanjiName").value,
            organization: document.getElementById("organization").value,
            incidentType: incidentType.value,
            area: document.getElementById("area").value,
            address: addressInput.value,
            mapLink: mapLinkInput.value,
            memo: document.getElementById("memo").value,
            peopleCount: peopleCount.value,
            unknownPeople: unknownPeople.checked
        };
        localStorage.setItem('formData', JSON.stringify(formData));
    }

    // フォームデータをlocalStorageから読み込む関数
    function loadFormData() {
        const storedFormData = localStorage.getItem('formData');
        if (storedFormData) {
            const formData = JSON.parse(storedFormData);
            Object.keys(formData).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = formData[key];
                    } else {
                        element.value = formData[key] || '';
                    }
                }
            });

            // "要救助者あり"が選択された場合の表示を復元
            if (incidentType.value === "要救助者あり") {
                rescueDetails.style.display = "block";
                peopleCount.required = true;
            } else {
                rescueDetails.style.display = "none";
                peopleCount.required = false;
            }

            // 人数不明チェックボックスがチェックされている場合の状態を復元
            peopleCount.disabled = unknownPeople.checked;

            // フォームの有効性をチェックし、送信ボタンの状態を更新
            let isValid = form.checkValidity();
            submitBtn.disabled = !isValid;
            submitBtn.classList.toggle("disabled", !isValid);
        }
    }
});